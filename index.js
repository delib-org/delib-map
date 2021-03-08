const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

// about page
app.get('/about', function (req, res) {
    res.render('pages/about');
});



app.get('/login', function (req, res) {

    const { mapId } = req.query;

    res.render('pages/login', { mapId });
});

app.get('/maps', function (req, res) {
    try {
        const user = req.cookies.user;

        res.render('pages/maps',);
    } catch (e) {
        res.redirect('/')
    }
});


app.get('/map', function (req, res) {

    const user = req.cookies.user;

    const { mapId } = req.query;

    if (user) {
        res.render('pages/map', { mapId });
    } else {
        res.redirect(`/login?mapId=${mapId}`)
    }


});


//static
app.use(express.static(__dirname + '/public'));
console.log(__dirname)



//routers
const mapsRoute = require("./maps/mapRoute");
app.use('/maps', mapsRoute);

const usersRouter = require('./users/usersRoute');
app.use('/users', usersRouter);


//mongooose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tal3:lqPlF8vfOm7Vd2Qt@tal-test1.m39if.mongodb.net/delib-maps', { useNewUrlParser: true, useUnifiedTopology: true });
const { ObjectId } = require('mongodb');


const db = mongoose.connection;
exports.db = db;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("we are connected to DB");
});


io.on('connection', socket => {

    console.log('a user connected');

    socket.on('node update', updatedNode => {
        console.log(updatedNode);
        io.emit('node update', updatedNode);
    });

});

const port = process.env.PORT || 3002

http.listen(port, () => {
    console.log('listening on port', port);
});