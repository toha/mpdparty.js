var events = require('events');
var util = require('util');
var _ = require('underscore');
var mpd = require('mpd'),
    cmd = mpd.cmd;

var Whishlist = function() {
  var self = this;
  events.EventEmitter.call(this);
  this.globalWishlist = [];
  this.minutesToClean = 20;

  // Regelmäßig alte bearbeitete Wünsche entfernen
  this.cleaningInterval = setInterval(function() { self.cleanWishlist(); }, 60*1000);
}
util.inherits(Whishlist, events.EventEmitter);

Whishlist.prototype.addItemToWishlist = function(item, user) {
  var self = this;

  item.user = user;
  item.date = new Date().getTime();

  // TODO Gibts das lied schon in der wunschliste?
  // TODO: hat der User schon 3x in 5 min was gewünscht?

  app.redis.hget("wishlist", item.user, function (err, obj) {
    if (err) throw new Error(err);
    var newWishlist;
    if (obj === null) {
      newWishlist = { wishes: [item] };
    }
    else {
      obj = JSON.parse(obj);
      obj.wishes.push(item);
      newWishlist = obj;
    }

    app.redis.hset("wishlist", item.user, JSON.stringify(newWishlist), function(err) {
      self.generateGlobalWishlist();
    });

  });

  console.log(item)
}

Whishlist.prototype.generateGlobalWishlist = function() {
  var self = this;
  app.redis.hgetall("wishlist", function (err, wishes) {
    if (err) throw new Error(err);

    var allWishes = [];
    for (var username in wishes) {
      var userwishes = JSON.parse(wishes[username]).wishes;
      userwishes.forEach(function(uw) {
        uw.username = username;
        allWishes.push(uw);
      });
    }

    self.globalWishlist =_.sortBy(allWishes, "date").reverse();
    app.socket.sockets.emit('wishlistupdate', self.globalWishlist);
  });
}

Whishlist.prototype.acceptRefuseSong = function(file, pos, accept, reason) {
  var self = this;
  // Ist der Song in der Wishlist?
  var listmatch = _.filter (this.globalWishlist, function(wish) {
      return wish.filename === file;
  });
  if (listmatch.length > 0) {
    // Ist drin
    var wish = listmatch[0];
    // wishlist des users der sich das gewünscht hat holen
    app.redis.hget("wishlist", wish.user ,function (err, userwishlist) {
      if (err) throw new Error(err);
      userwishlist = JSON.parse(userwishlist).wishes;

      // Wunsch in der Liste finden
      var userlistmatch = _.filter (userwishlist, function(uw) {
          return uw.filename === file;
      });
      if (userlistmatch.length > 0) {
        var userwish = userlistmatch[0];
        if (accept) {
          userwish.accepted = true;
        }
        else {
          userwish.accepted = false;
          userwish.reason = reason
        }
        userwish.acceptTime = new Date().getTime();

        app.redis.hset("wishlist", wish.user, JSON.stringify({ wishes: userwishlist }), function (err) {
          if (err) throw new Error(err);
          // Globale Liste neu laden
          self.generateGlobalWishlist();

          if (accept) {
            if (pos < 0) {
              app.mpd.sendCommand(cmd("add", ['"'+file+'"', ]), function(err, msg) {
                if (err) throw err;

              });
            }
            else {
              app.mpd.sendCommand(cmd("addid", ['"'+file+'"', pos]), function(err, msg) {
                if (err) throw err;

              });
            }
          }

        });

      }
    });


  }

}

Whishlist.prototype.cleanWishlist = function(file, pos, accept, reason) {
  var self = this;
   this.globalWishlist.forEach(function(wish) {
     if (wish.acceptTime) {
       var now = new Date().getTime();
       var tdiff = parseInt((now - wish.acceptTime) / 1000 / 60);
       console.log("tdiff: " + tdiff);
       if (tdiff >= self.minutesToClean) {
         self._deleteWish(wish);
         console.log("Deletewish");
       }
     }
   });
}

Whishlist.prototype._deleteWish = function(wish) {
  var self = this;
  // wishlist holen
  app.redis.hget("wishlist", wish.user ,function (err, userwishlist) {
    if (err) throw new Error(err);

    userwishlist = JSON.parse(userwishlist);
    var newwishlist = [];
    userwishlist.wishes.forEach(function(song) {
      if (song.filename !== wish.filename) {
        newwishlist.push(song);
      }
    });
    app.redis.hset("wishlist", wish.user , JSON.stringify({wishes: newwishlist}) ,function (err, userwishlist) {
      if (err) throw new Error(err);
      self.generateGlobalWishlist();
    });

  });

}


module.exports = new Whishlist();
