# Arduino-Socket-IO-Informatics-panel
Simple client - server combo that uses Socket-IO to communicate data with an arduino at real time (or the set baud rate).

I, personally, am going to use this to get information from an Arduino and it's sensors' data.

## Requirements

NodeJS

Some JavaScript knowledge

## Installation

In the terminal at the projects folder (where the package.json is):
```console
npm i
```

Create a .env file containing the Serial Port and Baud Rate at which your arduino operates:
```bash
SerialPort="COM3"
BaudRate="128000"
```

Now to run the server you can:
```console
node index.js
```

And finally to open it locally in your browser visit:

http://localhost:3000

## Usage

Create a listener event for whatever you want to listen to and get the data from it, change the global variable data.stats like so:
```JavaScript
  data.stats.CoolStatus = true
  data.stats.Moisture = 321
```
Finally, call the sendData() function to send it to the clients.
```JavaScript
  sendData()  
```

Rerun the server and refresh the website and you should see a box with "CoolStatus" and "true" as well as "Moisture", "321".
