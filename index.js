const express = require('express');
const app = express();
const http = require('http');
const { send } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style', (req, res) => {
    res.sendFile(__dirname + '/assets/style.css');
});

app.get('/light', (req, res) => {
    res.sendFile(__dirname + '/assets/light.css');
});


async function iterateDataFolder(){
    var html = "";
    const directoryInfo = fs
    .readdirSync("data")
    .map(file => {
        const path = `data/${file}`;
        var webPath = path;
        if(path.startsWith("//")){
            webPath = path.slice(1, path.length);
        }

        var fileStats;
        try {
            fileStats = fs.lstatSync(path);
        } catch (error) {}

        var isDir, size;
        if(fileStats){
            isDir = fileStats.isDirectory();
            size = fileStats.size;
        }
        return {
            name: file,
            path: path,
            webPath: webPath,
            isDir: isDir,
            size: size
        };
    })
    .sort((a, b) => b.isDir - a.isDir || a.name - b.name);

    directoryInfo.forEach(file => {
        if(file.name!=".gitkeep"){
            if(file.isDir){
                html += `<a href='${file.webPath}'><i>folder</i>${file.name}</a>`;
            }
            else{
                html += `<a><p>${file.name}</p><p>${humanFileSize(file.size)}</p></a>`;
            }
        }
    });
    html += "All data logs take up " + humanFileSize(await dirSize("data"))
    return html;
}

const dirSize = async directory => {
    const { readdir, stat } = require('fs/promises');
    const files = await readdir( directory );
    const stats = files.map( file => stat( path.join( directory, file ) ) );
  
    return ( await Promise.all( stats ) ).reduce( ( accumulator, { size } ) => accumulator + size, 0 );
}


io.on('connection', (socket) => {
    var sendData = JSON.stringify(data);
    io.emit("initData", sendData);
    console.log('a user connected');

    socket.on("datalog", async function(data, callback){
        var response;
        var error;
        if(data=="list"){
            response = await iterateDataFolder();
        }
        else{
            response = fs.readFileSync(path.join("data", data), {encoding: 'utf-8'});
        }
        callback(error, response);
    });

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

var scriptStartTime = Date.now();
var scriptStartTimeFormatted = new Date().toLocaleString().replaceAll("/", ".").replaceAll(":", "-");
console.log(scriptStartTimeFormatted);
fs.appendFile(`data/${scriptStartTimeFormatted}.txt`, `${scriptStartTime}\n`, function (err) {
    if (err) throw err;
});
function sendData(){
    var diffData = diff(data, lastData);
    if(JSON.stringify(data) != JSON.stringify(lastData)){
        var DataToSend = {};
        lastData = JSON.parse(JSON.stringify(data));
        DataToSend = JSON.stringify(diffData);
        io.emit("data", DataToSend);
        if(DataToSend){
            fs.appendFile(`data/${scriptStartTimeFormatted}.txt`, `${Date.now() - scriptStartTime}${DataToSend}\n`, function (err) {
                if (err) throw err;
            });
        }
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


// From MDUtils.js
function humanFileSize(bytes, si=true, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si 
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}