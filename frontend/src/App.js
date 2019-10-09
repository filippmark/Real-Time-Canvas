import React, {Component} from 'react';
import './App.css';

const URL = 'ws://localhost:8080'

class App extends Component{

  state = {
    lines: [],
    clicked: false,
    startCoords: {x1: 0, y1: 0},
    endCoords: {x2: 0, y2 :0}
  }

  ws = new WebSocket(URL);

  componentDidMount(){
    this.ws.onopen = () => {
      console.log('connected')
    }

    this.ws.onmessage = (event) => {
      
      let lines = JSON.parse(event.data);
      lines = lines.map((line) => {
        return JSON.parse(line);
      })
      console.log(lines);
      this.setState({lines}, this.drawLines);
    }


    this.refs.canvas.addEventListener('mousedown', this.mouseDownHandler, false);
    this.refs.canvas.addEventListener('mousemove', this.mouseMoveHandler, false);
    this.refs.canvas.addEventListener('mouseup',this.mouseUpHandler, false);
  }

  mouseDownHandler = (event) => {
      let {x, y} = this.getCoords(event);
      this.setState({
          clicked: true,
          startCoords: {
              x1: x, 
              y1: y
          }
      });
  }

  mouseMoveHandler = (event) => {
      if(this.state.clicked){
        let {x, y} = this.getCoords(event);
        this.setState({
            endCoords: {
                x2: x, 
                y2: y
            }
        }, this.drawLine);
      }
  }

  mouseUpHandler = (event) => {
      if (this.state.clicked){
        let {x, y} = this.getCoords(event);
        let endCoords = {
          x2: x, 
          y2: y
        };
        this.ws.send(JSON.stringify({startCoords: this.state.startCoords, endCoords, scale: this.getScale()}));
        this.setState({
            endCoords,    
            clicked: false
        });
      }
  }

  drawLine = () => {
    let ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.width);
    this.drawLines();
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#FF0000";
    let {x1, y1} = this.state.startCoords;
    let {x2, y2} = this.state.endCoords;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke(); 
  }

  drawLines = () => {
    let ctx = this.refs.canvas.getContext("2d");
    this.state.lines.forEach(line => {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#FF0000";
      let {x1, y1} = line.startCoords;
      let {x2, y2} = line.endCoords;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }

  getScale = () => {
    let coords = this.refs.canvas.getBoundingClientRect();
    const scaleX = this.refs.canvas.width / coords.width;
    const scaleY = this.refs.canvas.height / coords.height;
    return {
        scaleX,
        scaleY
    }
  }

  getCoords = (event) =>{
    let coords = this.refs.canvas.getBoundingClientRect();
    let x = event.clientX - coords.left;
    let y = event.clientY - coords.top;
    const {scaleX, scaleY} = this.getScale();
    x = x * scaleX;
    y = y * scaleY;
    let result = {
        x,
        y
    }
    return result;
  }

  getScale = () => {
    let coords = this.refs.canvas.getBoundingClientRect();
    const scaleX = this.refs.canvas.width / coords.width;
    const scaleY = this.refs.canvas.height / coords.height;
    return {
        scaleX,
        scaleY
    }
}

  render(){
    return (
      <div className="App">
        <canvas ref="canvas" className="canvas">

        </canvas>
      </div>
    );
  } 
}

export default App;
