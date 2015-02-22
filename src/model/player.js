var events = require('events');
var util = require('util');
var mpd = require('mpd'),
    cmd = mpd.cmd;
var Song = require("./song.js");
var io = require('socket.io');

var Player = function() {
  events.EventEmitter.call(this);
	this.currentsong = {};
}
util.inherits(Player, events.EventEmitter);


Player.prototype.loadPlayerInfo = function(statusmsg) {
	var self = this;

	app.mpd.sendCommand(cmd("currentsong", []), function(err, msg) {
		if (err) throw err;

		msg = msg.replace("file: ", "");
    var currentsong = new Song();
    currentsong.fromPlaylistFile(msg);

    // Time elapsed auslesen
    app.mpd.sendCommand(cmd("status", []), function(err, msg) {
      if (err) throw err;
      try {
        var timeelapsed = msg.split("time:")[1].split("\n")[0].split(":")[0].trim();
      }
      catch(Exception) {
        var timeelapsed = 0;
      }
      console.log("timeelapsed")
      console.log(timeelapsed)

      currentsong.timeelapsed = timeelapsed;
      currentsong.timeelpaseddate = new Date().getTime();
      self.currentsong = currentsong;

      app.socket.sockets.emit('playerupdate', currentsong);

    });


	});
}

module.exports = new Player();
