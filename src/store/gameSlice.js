import { createSlice } from '@reduxjs/toolkit';

// An array of game rounds
const initialState = [];

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setNewGameRound(state, action) {
      return [
        ...state,
        action.payload
      ];
    },
  },
});

export const {
  setNewGameRound,
} = gameSlice.actions;
export default gameSlice.reducer;
