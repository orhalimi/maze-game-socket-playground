import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './Canvas'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');


const COLORS = ["red", "blue", "green", "black", "purple", "pink", "gray"];
class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      players:null,
      isMoving:false,
      mousePos:{
        x:0,
        y:0
      },
      color:"",
    }
    this.startGameHandler = this.startGameHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.uniqId = makeid();
    this.getPlayersList = this.getPlayersList.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.updatePlayersList = this.updatePlayersList.bind(this);

    this.initSocketBinds();
    
  }

  getRandomColor(){
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  addPlayer(){
    const id = this.uniqId;
    const players = this.getPlayersList()
    players[id] = { x:350, y:350, r:13, fillColor:this.getRandomColor(), strokeColor:"black"}
    this.setState({
      players
    });
    const updateObj = {[this.uniqId]: players[this.uniqId]}
    socket.emit('addPlayer', updateObj);
  }

  startGameHandler(){
    this.addPlayer();
  }

  mouseDownHandler(e){
    if (this.state.players[this.uniqId]){
      e.preventDefault();
      this.setState({
        isMoving:true,
        mousePos:{
          x:e.pageX,
          y:e.pageY
        }
      });
    }
  }

  mouseUpHandler(e){
    e.preventDefault();
    this.setState({isMoving:false});
  }

  mouseMoveHandler(e) {
    if (this.state.isMoving && this.state.players[this.uniqId]){
      e.preventDefault();
      const difX = e.pageX - this.state.mousePos.x;
      const difY = e.pageY - this.state.mousePos.y;
      const players = this.getPlayersList();
      players[this.uniqId].x += difX;
      players[this.uniqId].y += difY;
      this.setState({
        players,
        mousePos:{
          x:e.pageX,
          y:e.pageY
        }
      });
      const updateObj = {[this.uniqId]: players[this.uniqId]}
      socket.emit("changePosition", updateObj);
    }
  }

  getPlayersList(){
    return JSON.parse(JSON.stringify(this.state.players)) || {};
  }

  updatePlayersList(players){
    this.setState({players});
  }

  initSocketBinds(){
    socket.on('updatePlayersList', this.updatePlayersList);
  }

  render() {
    return (
      <div className="App">
        <button id="start" onClick={this.startGameHandler}>
          Start game
        </button>
        <div className="canvas-container">
         <Canvas 
         players={this.state.players}
         onMouseMove = {this.mouseMoveHandler}
         onMouseUp = {this.mouseUpHandler}
         onMouseDown = {this.mouseDownHandler}
         />
        </div>
      </div>
    );
  }
}

export default App;

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
