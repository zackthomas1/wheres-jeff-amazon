import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { setNewGameRound } from './store/gameSlice';
import imageSrcA from './assets/wheresjeff.png';

const mockGameRounds = [
  {
    imageSrc: imageSrcA,
    coordinates: { 
      x: 261,
      y: 400
    },
    toleranceRadiusX: 120,
    toleranceRadiusY: 220,
    difficulty: 'easy'
  },
  {
    imageSrc: 'https://www.providencejournal.com/gcdn/authoring/2019/01/09/NPRJ/ghows-PJ-7f0e9188-00cb-1a2a-e053-0100007f329a-6d5b7ebf.jpeg?width=660&height=497&fit=crop&format=pjpg',
    coordinates: { 
      x: 200,
      y: 200
    },
    toleranceRadiusX: 100,
    toleranceRadiusY: 200,
    difficulty: 'easy'
  },
];

// TODO: replace with API call
const fetchNewGameRound = () => {
  const index = Math.floor(Math.random() * mockGameRounds.length);

  return mockGameRounds[index];
};

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
  const dispatch = useDispatch();
  const game = useSelector(state => state.game);
  const canvasRef = useRef(null);
  const [clickMessage, setClickMessage] = useState(null);
  const [isClickEnabled, setIsClickEnabled] = useState(false);
  const [headInstruction, setHeadInstruction] = useState(null);

  // const imageSrcA = "./assets/wheresjeff.png"; // place your image in the public folder or import it
  const handleNewGameRound = (newGame) => {
    dispatch(setNewGameRound(newGame));
  };

  // Get initial game round
  useEffect(() => {
    const gameRound = fetchNewGameRound();

    handleNewGameRound(gameRound);
  }, []);

  // Initialize canvas every time a new game round is loaded
  useEffect(() => {
    if (game.length > 0)
    {
      // Get latest round
      const gameRound = game[game.length - 1];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = gameRound.imageSrc;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };

      setIsClickEnabled(true);
      setClickMessage(null);
      setHeadInstruction("Find Jeff Amazon in the image");
    }
  }, [game]);

  const gameRound = game[game.length - 1];

  const handleCanvasClick = (event) => {
    if (! isClickEnabled)
    {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { coordinates, toleranceRadiusX, toleranceRadiusY } = gameRound;
    const { x: targetX, y: targetY } = coordinates;

    if ((Math.abs(x - targetX) < toleranceRadiusX) && (Math.abs(y - targetY) < toleranceRadiusY))
    {
      setClickMessage(<ClickMessage status="success" message="You found Jeff!" />);

      setIsClickEnabled(false);
      setHeadInstruction("Loading new image ...");
      setTimeout(() => {
        handleNewGameRound(fetchNewGameRound());
      }, 1000);
    }
    else
    {
      setClickMessage(<ClickMessage status="failure" message="That's not Jeff!" />);
    }
  };

  return (
    <div>
      <h2>{headInstruction}</h2>
      <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ border: "1px solid black" }} />
      <p>
        {clickMessage}
      </p>
    </div>
  );
};

export default CanvasClickApp;
