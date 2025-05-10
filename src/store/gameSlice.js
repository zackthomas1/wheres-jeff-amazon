import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRound: 1,
  imageSrc: '',
  targetCoordinates: { x: 0, y: 0 },
  toleranceRadiusX: 0,
  toleranceRadiusY: 0,
  difficulty: 'easy',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame(state, action) {
      return {
        ...action.payload,
        currentRound: 1,
      };
    },
    setRound(state, action) {
      state.currentRound = action.payload;
    },
    setTargetCoordinates(state, action) {
      state.targetCoordinates = action.payload;
    },
    setImageSrc(state, action) {
      state.imageSrc = action.payload;
    },
  },
});

export const {
  startNewGame,
  setRound,
  setTargetCoordinates,
  setImageSrc,
} = gameSlice.actions;
export default gameSlice.reducer;
