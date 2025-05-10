import { configureStore } from '@reduxjs/toolkit';

import userProfileReducer from './userProfileSlice';
import gameSettingsReducer from './gameSettingsSlice';
import gameReducer from './gameSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    gameSettings: gameSettingsReducer,
    game: gameReducer,
  },
});
