import React from 'react';

class Canvas extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
      this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  componentWillReceiveProps (newProps) {
    if( newProps.startsCounter !== this.props.startsCounter ) {
      this.addClientplayer();
    }
  }
  
  drawPlayers(ctx){
   for(let playerID in this.props.players){
      this.drawPlayer(ctx, this.props.players[playerID]);
    }
  }

  drawPlayer(ctx, player) {
    const startingAngle = 0, endAngle = 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, startingAngle, endAngle);
    ctx.fillStyle = player.fillColor;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.strokeStyle = player.strokeColor;
    ctx.stroke();
  }

  updateCanvas() {
      const ctx = this.refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, 700, 700);
      if (this.props.players) {
        this.drawPlayers(ctx);
      }
  }

  render() {
      return (
          <canvas id='canvas' ref="canvas" width={700} height={700} 
          onMouseDown={this.props.onMouseDown} 
          onMouseUp={this.props.onMouseUp}
          onMouseMove={this.props.onMouseMove}
          />
      );
  }
}

export default Canvas;







