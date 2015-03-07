var events = require('events');
var util = require('util');
var _ = require('underscore');
var mpd = require('mpd'),
    cmd = mpd.cmd;

var Photolist = function() {
  var self = this;
  events.EventEmitter.call(this);
  this.photos = [];
  app.redis.LRANGE("photos", 0,-1, function(err, msg) {
    if (!err) {
      msg.forEach(function(value) {
       self.photos.push(JSON.parse(value));
      })
    }
    console.log(self.photos);
  });

}
util.inherits(Photolist, events.EventEmitter);


Photolist.prototype.addPhotos = function(photos) {
  var self = this;
  photos.forEach(function(photo) {
    app.redis.RPUSH("photos", JSON.stringify({filename: photo}), function(err, msg) {
    });

    // Aus der Wunschliste löschen
    app.photowishlist.deleteByFilename(photo);

    self.photos.push({filename: photo});
  })


  app.socket.sockets.emit('photoupdate', self.photos);
}



module.exports = new Photolist();
