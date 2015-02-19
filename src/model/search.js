var events = require('events');
var util = require('util');
var mpd = require('mpd'),
    cmd = mpd.cmd;
var Song = require("./song.js");

var Search = function() {
  events.EventEmitter.call(this);
}
util.inherits(Search, events.EventEmitter);



module.exports = new Search();
