const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
exports.io = io;
require('./sockets/socket')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');

//static
app.use(express.static(__dirname + '/public'));

//view routes
const viewsRoute = require('./views/routes/pagesRoute');
app.use('/', viewsRoute)

//data routers
const mapsRoute = require("./routes/maps/mapRoute");
app.use('/maps', mapsRoute);

const usersRouter = require('./routes/users/usersRoute');
app.use('/users', usersRouter);


//mongooose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tal3:lqPlF8vfOm7Vd2Qt@tal-test1.m39if.mongodb.net/delib-maps', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
exports.db = db;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("we are connected to DB");
});


//listen
const port = process.env.PORT || 3002

http.listen(port, () => {
    console.log('listening on port', port);
});