var events = require('events');
var util = require('util');
var mpd = require('mpd'),
    cmd = mpd.cmd;
var Song = require("./song.js");

var Search = function() {
  events.EventEmitter.call(this);
}
util.inherits(Search, events.EventEmitter);

Search.prototype.search = function(query, callback) {
	  app.mpd.sendCommand(cmd("search", ["any", '"'+query+'"']), function(err, msg) {
      if (err) throw err;

      var songs = [];
      splitted = msg.split("file: ");
      splitted.forEach(function(value) {
        if (!value) return;

        var playlistsong = new Song();
        playlistsong.fromPlaylistFile(value);
        songs.push(playlistsong);

      });

      callback({
        result: songs
      });
  });
}

module.exports = new Search();
