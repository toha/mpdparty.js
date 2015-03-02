var io = require('socket.io');
var express = require('express');
var connect = require('connect');
var routes = require('routes');
var http = require('http');
var cookie = require('express/node_modules/cookie');
var parseSignedCookie = connect.utils.parseSignedCookie;
var fs = require('fs');
var util = require('util');
var uuid = require('node-uuid');
var url = require('url');

var cookiesecret = "SOMERANDOMCHARACTERS";

function HTTPServer() {
  var self = this;
  this.permissions = {};
  this.permissionsReqStartsWith = {};
  this.userSockets = {};
  this.uploadPath = "html/img/photo/raw/"

  this.http = express();
  this.http.configure(function(){
    self.http.use(express.compress());
    self.http.use(express.static('html'));

    self.http.use(express.bodyParser());
    self.http.use(express.methodOverride());

    self.http.use(express.cookieParser());
    self.http.use(express.session({secret: cookiesecret, key: 'sid'}));

  });

  this.http.configure('development', function(){
    self.http.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  this.http.configure('production', function(){
    self.http.use(express.errorHandler());
  });

  this.httpserver = http.createServer(this.http).listen(7777);
  this.socketio = io.listen(this.httpserver, { log: false });


  this.socketio.on('connection', function (socket) {
  });


  self.http.post("/api/newuser", function(req, res) {
    console.log("newuser: " + req.body.name);
    if (req.body.name) {
      app.redis.get("mpd:" + req.body.name, function (err, obj) {
         if (obj === null) {
           app.redis.set("mpd:" + req.body.name, {}, function (err, obj) {
             res.send("ok");
           });
         }
         else {
           res.send("notok");
         }
      });
    }
    else {
      res.send("notok");
    }
  });

  self.http.get("/api/getplaylist", function(req, res) {
    res.send({ songs: app.playlist.songs });
  });

  self.http.get("/api/getcurrentsong", function(req, res) {
    res.send(app.player.currentsong);
  });

  self.http.get("/api/getwishlist", function(req, res) {
    res.send({ songs: app.wishlist.globalWishlist });
  });

  self.http.get("/api/getphotowishlist", function(req, res) {
    res.send({ photos: app.photowishlist.wishlist });
  });

  self.http.post("/api/search", function(req, res) {
    app.search.search(req.body.query, function(result) {
      console.log(result);

      res.send(result);
    });
  });

}
module.exports = new HTTPServer();
