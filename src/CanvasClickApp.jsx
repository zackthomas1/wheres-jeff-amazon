import React, { useRef, useEffect, useState } from "react";
import imageSrc from './assets/wheresjeff.png';

const CanvasClickApp = () => {
  const canvasRef = useRef(null);
  const [clicks, setClicks] = useState([]);

  // const imageSrc = "./assets/wheresjeff.png"; // place your image in the public folder or import it

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setClicks([...clicks, { x: Math.round(x), y: Math.round(y) }]);
  };

  return (
    <div>
      <h2>Click on the image to get coordinates</h2>
      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ border: "1px solid black" }} />
      <ul>
        {clicks.map((click, index) => (
          <li key={index}>
            Click {index + 1}: (x: {click.x}, y: {click.y})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CanvasClickApp;
