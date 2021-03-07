const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));


io.on('connection', socket => {
   
    console.log('a user connected');

    socket.on('chat message', message => {
        console.log('message: ' + message);
        io.emit('chat message', message);
    });

    
});


const port = process.env.PORT || 3002


http.listen(port, () => {
    console.log('listening on port', port);
});