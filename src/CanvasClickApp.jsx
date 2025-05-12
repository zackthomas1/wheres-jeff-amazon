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
        coordX: 725,
        coordY: 1340,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
      {
        name: "Rubber Duck",
        coordX: 590,
        coordY: 1230,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcB,
    targets: [
      {
        name: "Red Ball",
        coordX: 195,
        coordY: 1220,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
      {
        name: "Rubber Duck",
        coordX: 560,
        coordY: 900,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcC,
    targets: [
      {
        name: "Red Ball",
        coordX: 330,
        coordY: 1380,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
      {
        name: "Rubber Duck",
        coordX: 390,
        coordY: 880,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
    ],
    difficulty: 'easy'
  },
  {
    imageSrc: imageSrcD,
    targets: [
      {
        name: "Red Ball",
        coordX: 340,
        coordY: 1020,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
      {
        name: "Rubber Duck",
        coordX: 290,
        coordY: 1180,
        toleranceRadiusX: 100,
        toleranceRadiusY: 100,
      },
    ],
    difficulty: 'easy'
  },
];

// TODO: replace with API call
const fetchNewGameRound = async() => {
  const db_api_end_point = "https://y05g5q0w6c.execute-api.us-west-2.amazonaws.com/prod/game-round"; 
  const resp = await fetch(db_api_end_point); 
  if (resp.ok){
    const resp_obj = await resp.json(); 
    const s3_key = resp_obj.s3_image_key;
    const s3_api_end_point = `https://y05g5q0w6c.execute-api.us-west-2.amazonaws.com/prod/get-image-from-s3/${s3_key}`;
    resp_obj["imageSrc"] = s3_api_end_point;
    return resp_obj;
  }else{
    return null; 
  }

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
  useEffect(async () => {
    const gameRound = await fetchNewGameRound();

    handleNewGameRound(gameRound);
  }, []);

  // Initialize canvas every time a new game round is loaded
  useEffect(() => {
    console.log('gameRound:', gameRound);

    if ((game.length > 0) && (canvasRef !== null) && (canvasRef.current !== null))
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
      const { name, coordX, coordY, toleranceRadiusX, toleranceRadiusY } = target;

      if ((Math.abs(x - coordX) < toleranceRadiusX) && (Math.abs(y - coordY) < toleranceRadiusY))
      {
        if (foundTargets.hasOwnProperty(name))
        {
          setClickMessage(<ClickMessage status="failure" message={`You already found the ${name}`} />);
        }
        else
        {
          setFoundTargets({ ...foundTargets, [name]: true });
          setClickMessage(<ClickMessage status="success" message={`You found the ${name}!`} />);
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

  if (gameRound && gameRound.targets)
  {
    return (
      <div>
        <h2>{headInstruction}</h2>
        <h3>I spy with my little eye...</h3>
        <ul>
          {gameRound?.targets.map(({ name }) => (<li>A {name}</li>))}
        </ul>
        <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ border: "1px solid black" }} />
        <p>
          {clickMessage}
        </p>
      </div>
    );
  }
  else
  {
    return <p>Loading ...</p>
  }
};

export default CanvasClickApp;
