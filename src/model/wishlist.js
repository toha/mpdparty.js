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



module.exports = new Whishlist();
