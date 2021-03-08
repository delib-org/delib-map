"use strict";

var express = require('express');

var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

var cookieParser = require('cookie-parser');

app.use(cookieParser());

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.set('view engine', 'ejs'); // index page

app.get('/', function (req, res) {
  res.render('pages/index');
}); // about page

app.get('/about', function (req, res) {
  res.render('pages/about');
});
app.get('/login', function (req, res) {
  var mapId = req.query.mapId;
  res.render('pages/login', {
    mapId: mapId
  });
});
app.get('/maps', function (req, res) {
  try {
    var user = req.cookies.user;
    res.render('pages/maps');
  } catch (e) {
    res.redirect('/');
  }
});
app.get('/map', function (req, res) {
  var user = req.cookies.user;
  var mapId = req.query.mapId;

  if (user) {
    //db
    res.render('pages/map', {
      mapId: mapId
    });
  } else {
    res.redirect("/login?mapId=".concat(mapId));
  }
}); //static

app.use(express["static"](__dirname + '/public'));
console.log(__dirname); //routers

var mapsRoute = require("./maps/mapRoute");

app.use('/maps', mapsRoute);

var usersRouter = require('./users/usersRoute');

app.use('/users', usersRouter); //mongooose

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tal3:lqPlF8vfOm7Vd2Qt@tal-test1.m39if.mongodb.net/delib-maps', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var _require = require('mongodb'),
    ObjectId = _require.ObjectId;

var db = mongoose.connection;
exports.db = db;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we are connected to DB");
});
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