import React, { useRef, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { loadAllGeometry } from "./modules/Model.js";

const ThreeModelContainer = props => {
  const threeModelCanvasRef = useRef(null);

  useEffect(() => {
    loadAllGeometry(threeModelCanvasRef.current);
  }, [threeModelCanvasRef]);

  return (
    <div className="threeModelContainer">
      <canvas className="threeModelCanvas" ref={threeModelCanvasRef}></canvas>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ThreeModelContainer></ThreeModelContainer>
    </div>
  );
}

export default App;
