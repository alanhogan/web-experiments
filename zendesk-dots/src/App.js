import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ThreeDotMonte from "./ThreeDotMonte";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">Demo time.</p>
        <div style={{ color: "#17c" }}>
          <ThreeDotMonte _width={40} />
        </div>
      </div>
    );
  }
}

export default App;
