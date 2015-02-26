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
