var events = require('events');
var util = require('util');

var Song = function() {
  events.EventEmitter.call(this);
}
util.inherits(Song, events.EventEmitter);


Song.prototype.fromPlaylistFile = function(plf) {
	var lines = plf.split("\n");
	this.filename = lines[0];
	for (var i=1; i<lines.length-1; i++) {
		var line = lines[i];
		splittedargvalue = line.split(": ");
		this[splittedargvalue[0].toLowerCase()] = splittedargvalue[1];
  }
}


module.exports = Song;
