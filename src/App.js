import React, { useRef, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { loadAllGeometry, rotateTrailingArmX, rotateTrailingArmY, rotateTrailingArmZ } from "./modules/Model.js";

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
  const [angle, setAngle] = useState(0.01);

  const handleRotatex = (e) => {
    rotateTrailingArmX(angle)
  }

  const handleRotatexx = (e) => {
    rotateTrailingArmX(-angle)
  }

  const handleRotatey = (e) => {
    rotateTrailingArmY(angle)
  }

  const handleRotateyy = (e) => {
    rotateTrailingArmY(-angle)
  }

  const handleRotatez = (e) => {
    rotateTrailingArmZ(angle)
  }

  const handleRotatezz = (e) => {
    rotateTrailingArmZ(-angle)
  }


  return (
    <div className="App">
      <ThreeModelContainer></ThreeModelContainer>
      <button onClick={handleRotatex}>+X</button>
      <button onClick={handleRotatexx}>-X</button>
      <button onClick={handleRotatey}>+Y</button>
      <button onClick={handleRotateyy}>-Y</button>
      <button onClick={handleRotatez}>+Z</button>
      <button onClick={handleRotatezz}>-Z</button>
    </div>
  );
}

export default App;
