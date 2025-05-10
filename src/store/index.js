import { configureStore } from '@reduxjs/toolkit';

import userProfileReducer from './userProfileSlice';
import gameSettingsReducer from './gameSettingsSlice';
import gameReducer from './gameSlice';
import leaderBoardReducer from './leaderBoardSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    gameSettings: gameSettingsReducer,
    game: gameReducer,
    leaderBoard: leaderBoardReducer,
  },
});
