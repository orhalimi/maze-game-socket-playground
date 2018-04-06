const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser')
const io = require('socket.io')(http);
const cors = require('cors');
const _ = require('lodash');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const playersList = {};
const sessionList = {};


io.on('connection',(socket) => {
  console.log("player connected!");

  socket.on('addPlayer', (newPlayer) => {
    const ID = _.keys(newPlayer)[0];
    sessionList[socket.id] = ID;
    _.merge(playersList,newPlayer)
    for (playerID in playersList){
      resetPosition(playersList[playerID]);
    }    
    io.sockets.emit('updatePlayersList', playersList);
 });

 socket.on('changePosition', UpdatePlayerObj =>{
    _.merge(playersList,UpdatePlayerObj);
    socket.broadcast.emit('updatePlayersList',playersList)
 });

 socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete playersList[sessionList[socket.id]];
    console.log(playersList);
    io.sockets.emit('updatePlayersList', playersList);
 });
});

http.listen(8080, () =>{
  console.log('listening on 8080');
});

const resetPosition = player =>{
  player.x = 350; 
  player.y = 350;
}