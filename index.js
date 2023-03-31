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

app.get('/light', (req, res) => {
    res.sendFile(__dirname + '/assets/light.css');
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

// data.stats.isCool = true
// data.stats.somethingElse = "that is lotta informacio!"
// var i = 0;
// function glupost(){
//     data.stats.Moisture = i
//     sendData()
//     i++
// }

// setInterval(glupost, 1000)


const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: 'COM3', baudRate: 128000 })

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

parser.on('data', function(arduinoData){
    arduinoData = JSON.parse(arduinoData)
    data.stats = arduinoData
    sendData()
})