import React, { useRef, useEffect, useState } from "react";
import imageSrcA from './assets/wheresjeff.png';

const mockGameRounds = [
  {
    image: imageSrcA,
    coordinates: { 
      x: 261,
      y: 400
    },
    toleranceRadiusX: 120,
    toleranceRadiusY: 220,
    difficulty: 'easy'
  }
];

const ClickMessage = ({ status, message }) => {
  let spanStyle = null;

  switch (status)
  {
    case 'success':
      spanStyle = { backgroundColor: 'green' };
      break;
    case 'failure':
      spanStyle = { backgroundColor: 'red' };
      break;
  }// end switch (status)

  return (
    <span style={spanStyle}>
      {message}
    </span>
  );
};

const CanvasClickApp = () => {
  const canvasRef = useRef(null);
  const [gameRound, setGameRound] = useState(mockGameRounds[0]);
  const [clickMessage, setClickMessage] = useState(null);

  // const imageSrcA = "./assets/wheresjeff.png"; // place your image in the public folder or import it

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = gameRound.image;
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

    const { coordinates, toleranceRadiusX, toleranceRadiusY } = gameRound;
    const { x: targetX, y: targetY } = coordinates;

    if ((Math.abs(x - targetX) < toleranceRadiusX) && (Math.abs(y - targetY) < toleranceRadiusY))
    {
      setClickMessage(<ClickMessage status="success" message="You found Jeff!" />);
    }
    else
    {
      setClickMessage(<ClickMessage status="failure" message="That's not Jeff!" />);
    }
  };

  return (
    <div>
      <h2>Click on the image to get coordinates</h2>
      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ border: "1px solid black" }} />
      <p>
        {clickMessage}
      </p>
    </div>
  );
};

export default CanvasClickApp;
