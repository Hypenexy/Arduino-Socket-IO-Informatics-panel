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
    var sendData = JSON.stringify(data);
    io.emit("initData", sendData);
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

var data = { "stats" : {} };
var lastData;

function diff(obj1, obj2) {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            result[key] = obj1[key];
        }
        if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = diff(obj1[key], obj2[key]);
            if (value !== undefined) {
                result[key] = value;
            }
        }
    });
    return result;
}
function sendData(){
    var diffData = diff(data, lastData)
    if(JSON.stringify(data) == JSON.stringify(lastData)){}
    else{
        var DataToSend = {}
        lastData = JSON.parse(JSON.stringify(data))
        DataToSend = JSON.stringify(diffData);
        io.emit("data", DataToSend);
    }
}

server.listen(3000, () => {
    console.log('Web server listening on *:3000');
});


//Example of inputing data through console once
// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
// readline.question(`What's your data my friend?`, input => {
//         console.log(`You should see "${input}" on your browser!`);
//         data.stats.myFriend = input;
//         sendData();
//         readline.close();
// });

//Example of stats data
// data.stats.isCool = true
// data.stats.somethingElse = "that is lotta informacio!"
// var i = 0;
// function glupost(){
//     data.stats.Moisture = i
//     sendData()
//     i++
// }
// setInterval(glupost, 1000)

require('dotenv').config()
console.log("Attempting to listen to serial port " + process.env.SerialPort)
console.log("With a baud rate at " + process.env.BaudRate)

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: process.env.SerialPort, baudRate: parseInt(process.env.BaudRate) })

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

parser.on('data', function(arduinoData){
    // console.log(arduinoData)
    arduinoData = JSON.parse(arduinoData)
    data.stats = arduinoData
    sendData()
})