var events = require('events');
var util = require('util');
var fs = require('fs');
var mpd = require('mpd');
var cmd = mpd.cmd;
var chainGang = require('chain-gang');
var im = require('imagemagick');
var childprocess = require('child_process');

var FileUploadCtrl = function() {
  var self = this;
  events.EventEmitter.call(this);
  this.songs = [];
  this.queue = chainGang.create({workers: 1});

}
util.inherits(FileUploadCtrl, events.EventEmitter);


FileUploadCtrl.prototype.processUpload = function(fileobj) {
  var self = this;
  console.log("Added to Queue")
  console.log(fileobj);


  this.queue.add(this.queueRunner, JSON.stringify(fileobj));
}


module.exports = new FileUploadCtrl();
