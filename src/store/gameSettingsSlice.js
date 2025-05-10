import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  difficulty: 'easy'
};

const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },
  },
});

export const { setDifficulty } = gameSettingsSlice.actions;
export default gameSettingsSlice.reducer;
