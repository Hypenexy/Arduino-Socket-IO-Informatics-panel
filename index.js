const express = require('express');
const app = express();
const http = require('http');
const { send } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style', (req, res) => {
    res.sendFile(__dirname + '/assets/style.css');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

var data = { "stats" : {} };

function sendData(){
    dataStr = JSON.stringify(data);
    io.emit("data", dataStr);
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
// readline.question(`What's your data my friend?`, input => {
//         console.log(`You should see "${input}" on your browser!`);
//         eventListenerEmulator(input)
//         readline.close();
// });

function glupost(i){
    if(i === undefined){
        i = 0
    }
    data.stats.moisture = i
    sendData()
    setTimeout(() => {
        i++
        glupost(i)
    }, 1000);
}

glupost()