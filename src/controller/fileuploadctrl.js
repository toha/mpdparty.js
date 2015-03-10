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

FileUploadCtrl.prototype.queueRunner = function(job) {
  console.log("queueRunner");
    var err;
    var fileobj = JSON.parse(job.name);

    // Prüfen ob es die Datei gibt
    fs.exists(fileobj.tmpname, function(exists) {
      if (exists) {

        // Versuchen Das Bild zu verkleinern
        var resizeOptions = {
          srcPath: fileobj.tmpname,
          dstPath: app.uploadFilePath + "big/" + fileobj.filename,
          quality: 0.8,
          format: 'jpg',
          width: 1024
        }

        im.resize(resizeOptions, function(err, stdout, stderr){
          if (err)  {
            job.finish(err);
          }

          var resizeOptionsThumb = {
            srcPath: fileobj.tmpname,
            dstPath: app.uploadFilePath + "thumb/" + fileobj.filename,
            quality: 0.8,
            format: 'jpg',
            width: 100
          }

          im.resize(resizeOptionsThumb, function(err, stdout, stderr){
            if (err)  {
              job.finish(err);
            }

            childprocess.spawn('mv', [fileobj.tmpname, app.uploadFilePath + "raw/" + fileobj.filename])

            app.photowishlist.addWish(fileobj);


            job.finish(null, fileobj);

          });

        });

      }
      else {
        job.finish(err);
      }
    });

}

/*FileUploadCtrl.prototype.onTaskFinish = function(name) {

}*/

module.exports = new FileUploadCtrl();
