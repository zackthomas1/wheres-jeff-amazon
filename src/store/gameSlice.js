import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startFirstGame(state, action) {
      ...action.payload,
        currentRound: 1
    },
    startNextGame(state, action) {
      const { currentRound } = state;
      return {
        ...action.payload,
        currentRound: currentRound + 1,
      };
    },
  },
});

export const {
  startFirstGame,
  startNextGame,
} = gameSlice.actions;
export default gameSlice.reducer;
