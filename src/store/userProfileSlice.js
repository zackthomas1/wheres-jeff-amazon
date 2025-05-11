import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  cumulativeScore: 0,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    incrementScore(state, action) {
      state.cumulativeScore += action.payload;
    },
  },
});

export const { setUsername, incrementScore } = userProfileSlice.actions;
export default userProfileSlice.reducer;
