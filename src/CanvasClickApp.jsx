import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'

import { setNewGameRound } from './store/gameSlice';

import imageSrcA from './assets/i_spy_demo_00.png';
import imageSrcB from './assets/i_spy_demo_01.png';
import imageSrcC from './assets/i_spy_demo_02.png';
import imageSrcD from './assets/i_spy_demo_03.png';

const mockGameRounds = [
  {
    imageSrc: imageSrcA,
    targets: [
      {
        name: "Red Ball",
        coordinates: { 
          x: 261,
          y: 400
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
      {
        name: "Rubber Duck",
        coordinates: { 
          x: 361,
          y: 300
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcB,
    targets: [
      {
        name: "Red Ball",
        coordinates: { 
          x: 261,
          y: 400
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
      {
        name: "Rubber Duck",
        coordinates: { 
          x: 361,
          y: 300
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcC,
    targets: [
      {
        name: "Red Ball",
        coordinates: { 
          x: 261,
          y: 400
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
      {
        name: "Rubber Duck",
        coordinates: { 
          x: 361,
          y: 300
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcD,
    targets: [
      {
        name: "Red Ball",
        coordinates: { 
          x: 261,
          y: 400
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
      {
        name: "Rubber Duck",
        coordinates: { 
          x: 361,
          y: 300
        },
        toleranceRadiusX: 120,
        toleranceRadiusY: 220,
      },
    ],
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
  const [foundTargets, setFoundTargets] = useState({});

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
      setHeadInstruction("Find the named objects in the image");
    }
  }, [game]);

  const gameRound = game[game.length - 1];

  // check if we've found all targets
  useEffect(() => {
    if ((gameRound) && (Object.keys(foundTargets).length == gameRound.targets.length))
    {
      // Move to next round
      setIsClickEnabled(false);
      setFoundTargets({});
      setHeadInstruction("Loading new image ...");
      setClickMessage(<ClickMessage status="success" message="All targets found!" />);

      setTimeout(() => {
        handleNewGameRound(fetchNewGameRound());
      }, 1000);
    }
  }, [foundTargets]);

  const handleCanvasClick = (event) => {
    if (! isClickEnabled)
    {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { targets } = gameRound;

    let targetFound = false;

    for (const target of targets)
    {
      const { name, coordinates, toleranceRadiusX, toleranceRadiusY } = target;
      const { x: targetX, y: targetY } = coordinates;

      if ((Math.abs(x - targetX) < toleranceRadiusX) && (Math.abs(y - targetY) < toleranceRadiusY))
      {
        if (foundTargets.hasOwnProperty(name))
        {
          setClickMessage(<ClickMessage status="failure" message={`You already found ${name}`} />);
        }
        else
        {
          setFoundTargets({ ...foundTargets, [name]: true });
          setClickMessage(<ClickMessage status="success" message={`You found ${name}!`} />);
        }

        targetFound = true;
        break;
      }
    }// end for (target of targets)
    
    if (! targetFound)
    {
        setClickMessage(<ClickMessage status="failure" message={`Nothing there`} />);
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
