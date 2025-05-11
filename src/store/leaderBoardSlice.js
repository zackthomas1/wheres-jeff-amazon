import { createSlice } from '@reduxjs/toolkit';

// Item format:
//  - username
//  - score

const initialState = [];

const gameSlice = createSlice({
  name: 'leaderBoard',
  initialState,
  reducers: {
    addUserScore(state, action) {
      const out = [...state, action.payload];
      out.sort((a, b) => b.score - a.score);

      return out;
    }
  },
});

export const {
  addUserScore,
} = gameSlice.actions;
export default gameSlice.reducer;
