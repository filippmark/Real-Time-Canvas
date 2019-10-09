import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component{

  state = {
    lines: [],
    startCoords: {x: 0, y: 0},
    endCoords: {x: 0, y :0}
  }

  componentDidMount(){
    
  }


  render(){
    return (
      <div className="App">
        <canvas>

        </canvas>
      </div>
    );
  } 
}

export default App;
