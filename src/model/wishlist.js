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


module.exports = new Whishlist();
