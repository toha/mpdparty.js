var events = require('events');
var util = require('util');
var mpd = require('mpd'),
    cmd = mpd.cmd;
var Song = require("./song.js");

var Playlist = function() {
  events.EventEmitter.call(this);
	this.songs = [];
}
util.inherits(Playlist, events.EventEmitter);


Playlist.prototype.loadPlaylist = function(plf) {
	var self = this;
	app.mpd.sendCommand(cmd("playlistinfo", []), function(err, msg) {
		if (err) throw err;
		var newsongs = []
		splitted = msg.split("file: ");
		splitted.forEach(function(value) {
			if (!value) return;

			var playlistsong = new Song();
			playlistsong.fromPlaylistFile(value);
			newsongs.push(playlistsong);

		});


		// Sind die playlists gleich?
		var n = false;
		if (self.songs.length === newsongs.length) {
		  var tmpn = true;
		  for (var i=0; i< newsongs.length; i++) {
		    if (JSON.stringify(self.songs[i]) !== JSON.stringify(newsongs[i])) {
		      tmpn = false;
		      break;
		    }
		  }
		  n = tmpn;
		}

		if (!n) {
			self.songs = newsongs;

			app.socket.sockets.emit('playlistupdate', newsongs);
		}



	});
}


module.exports = new Playlist();
