# Socket-IO-Informatics-panel
Simple client - server combo that uses Socket-IO to communicate data real time.

I, personally, am going to use this to get information from an Arduino and it's sensors' data.

## Requirements

NodeJS

Some JavaScript knowledge

## Installation

In the terminal at the projects folder (where the package.json is):
```console
npm i
```

Now to run the server you can:
```console
node index.js
```

And finally to open it locally in your browser visit:

http://localhost:3000

## Usage

Create a listener event for whatever you want to listen to and get the data from it, call the sendData() function with a *JSON* parameter containing the data in the following format:
```JSON
  {
    "stats" : {
      "CoolStatus" : true
    }
  }
```

Rerun the server and refresh the website and you should see a box with "CoolStatus" and "true". 
