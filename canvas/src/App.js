import React, { Component } from 'react';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import './App.css';

class App extends Component {
  state = {
    showWidgetPanel: false
  }

  handleClick = () => {
    console.log('clicked!');
    const show = this.state.showWidgetPanel;
    this.setState({ showWidgetPanel: !show })
  }

  render() {
    return (
      <div className="App">
        <Toolbar show={this.state.showWidgetPanel}/>
        <button onClick={this.handleClick}>Open Toolbar</button>
      </div>
    );
  }
}

export default App;