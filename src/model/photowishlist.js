var events = require('events');
var util = require('util');
var _ = require('underscore');
var mpd = require('mpd'),
    cmd = mpd.cmd;

var PhotoWhislist = function() {
  var self = this;
  events.EventEmitter.call(this);
  this.wishlist = [];
  app.redis.LRANGE("photowishlist", 0,-1, function(err, msg) {
    if (!err) {
      msg.forEach(function(value) {
        self.wishlist.push(JSON.parse(value));
      })
    }
  });
}
util.inherits(PhotoWhislist, events.EventEmitter);

PhotoWhislist.prototype.addWish = function(wish) {
  var self = this;

  wish.time = new Date().getTime();
  this.wishlist.push(wish);
  app.redis.RPUSH("photowishlist", JSON.stringify(wish), function(err) {
    app.socket.sockets.emit('photowishlistupdate', self.wishlist);
  });
}

PhotoWhislist.prototype.deleteByFilename = function(filename, noemit) {
  var self = this;
  // Index rausfinden
  var idx = -1;
  var idxadd = 0;
  var eel = null;
  for (var i=0; i<this.wishlist.length; i++) {
    var w = self.wishlist[i];
    if (w.filename  && w.filename === filename) {
      idx = i;
      eel = w;
      break;
    }

  }

  if (idx > -1) {
    app.redis.LREM("photowishlist", 0, JSON.stringify(eel), function(err) {
      console.log(err)
    });

    self.wishlist.splice(idx, 1);
    if (!noemit) {
      app.socket.sockets.emit('photowishlistupdate', self.wishlist);
    }
  }


}

PhotoWhislist.prototype.deleteAllByFilename = function(files) {
  var self = this;

  for (var i=0; i< files.length; i++) {
    var filename = files[i];
    self.deleteByFilename(filename, true);
  };
  app.socket.sockets.emit('photowishlistupdate', self.wishlist);

}


module.exports = new PhotoWhislist();
