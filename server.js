var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { getJsonObject } = require('./translate.js');
const { exec } = require('child_process');

app.get('/', function(req, res){
//   res.sendFile(__dirname + '/data/2017_Gaz_zcta_national.txt');
//   res.sendFile(__dirname + '/data/zipcodeLookups.json');
//   res.sendFile(__dirname + '/data/zipcodes.geojson');
//   res.sendFile(__dirname + '/data/affiliates.geojson');

    res.sendFile(__dirname + '/index.html');
});

app.get('/data/2017_Gaz_zcta_national.txt', function(req, res){

    res.sendFile(__dirname + '/data/2017_Gaz_zcta_national.txt');
});

app.get('/data/zipcodeLookups.json', function(req, res){

    res.sendFile(__dirname + '/data/zipcodeLookups.json');
});

app.get('/data/zipcodes.geojson', function(req, res){

    res.sendFile(__dirname + '/data/zipcodes.geojson');
});

app.get('/data/affiliates.geojson', function(req, res){

    res.sendFile(__dirname + '/data/affiliates.geojson');
});


io.on('connection', function(socket){
    // io.emit('train complete');
  socket.on('train request', function(budget, msg3){
    console.log('message: ' + budget + msg3);
    exec('python train.py ' + msg3, (err, stdout, stderr) => {
            if (err) {
              //some err occurred
              console.error(err)
            } else {
             // the *entire* stdout and stderr (buffered)
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             getJsonObject()
             io.emit('train complete');
            }
          });
  });

  console.log('a user connected');
  
  io.send()
});

// Creates a server which runs on port 3000 and
// can be accessed through localhost:3000
http.listen(8000, function() {
    console.log('server running on port 8000');
} )
