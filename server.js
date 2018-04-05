//Dependencies

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = process.env.port || 1337;

app.set('port', port);
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

var updatesPerSecond = 5;

// Routing

app.get('/', function(request, response) { 
	response.sendFile(path.join(__dirname, 'index.html'));
});


//Starts the server.

server.listen(app.get('port'), function(){
	console.log('Starting server on port '+port);
});

//Add the Websocket handlers
var players = {};
var count = 0;
var counter = 0;
io.on('connection', function(socket) {
  socket.on('new player', function() {
	var newPlayer = {};
	var newPlayerInfo = {};
	newPlayer.input = {};
	newPlayer.input.up = false;
	newPlayer.input.down = false;
	newPlayer.input.left = false;
	newPlayer.input.right = false;
	if(counter==0)
	{
		newPlayer.input.position = {x: 300, y: 300};
		counter++;
	}
	else
		newPlayer.input.position = {x: 200, y: 200};
	newPlayer.input.warp = false;
    players[socket.id] = newPlayer;
	
	newPlayerInfo.Id = socket.id;
	newPlayerInfo.position = newPlayer.input.position;
	socket.emit('new player ack', newPlayerInfo);//client responds with new player ready
  });
  
  socket.on('new player ready', function() {
	  //begin sending updates to the client
	setInterval(function() {
		socket.emit('state', players);
		}, 1000 / updatesPerSecond);		
	socket.emit('new player ready ack');
  });
  
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    player.position = data.position;
	player.velocity = data.velocity;
	player.direction = data.direction;
  });
  
  socket.on('input', function(data) {
    var player = players[socket.id];
    player.input.up = data.up;
	player.input.down = data.down;
	player.input.left = data.left;
	player.input.right = data.right;
	player.input.position = data.position;
	player.input.warp = false;
  });
  
  socket.on('disconnect', function (data) {
	delete players[socket.id];
  });
});


