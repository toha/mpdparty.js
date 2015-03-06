var mpd = require('mpd'),
    cmd = mpd.cmd
var mpdclient = mpd.connect({
  port: 6600,
  host: '192.168.0.10',
});
var redis = require("redis");
redisclient = redis.createClient();

GLOBAL.app = {};
app.uploadFilePath = "/home/tobi/dev/sandbox/nodempd/webapp/img/photo/";
app.mpd = mpdclient;
app.redis = redisclient;
app.playlist = require("./model/playlist.js");
app.player = require("./model/player.js");
app.search = require("./model/search.js");
app.wishlist = require("./model/wishlist.js");
app.fileUploadCtrl = require("./controller/fileuploadctrl.js");
app.photowishlist = require("./model/photowishlist.js");
app.photolist = require("./model/photolist.js");


app.http = require("./http.js");
app.socket = app.http.socketio;


var Song = require("./model/song.js");


mpdclient.on('ready', function() {

	app.playlist.loadPlaylist();
	app.player.loadPlayerInfo();
	app.wishlist.generateGlobalWishlist();


});
mpdclient.on('system', function(name) {
  //console.log("update", name);
	if (name === "playlist") {
		app.playlist.loadPlaylist();
	}
	else if (name === "player") {
		//app.player.loadPlayerInfo();
	}
});
mpdclient.on('system-player', function() {
  console.log("SYSTEM-PLAYER-UPDATE");
  app.player.loadPlayerInfo();
});

process.on('uncaughtException', function(err) {
  console.log(err);
});
