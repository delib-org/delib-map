"use strict";

var express = require('express');

var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(express["static"]('public'));
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('node update', function (updatedNode) {
    console.log(updatedNode);
    io.emit('node update', updatedNode);
  });
});
var port = process.env.PORT || 3002;
http.listen(port, function () {
  console.log('listening on port', port);
});