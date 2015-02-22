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




	});
}

module.exports = new Player();
