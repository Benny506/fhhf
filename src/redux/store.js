import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import siteContentReducer from './slices/siteContentSlice';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    siteContent: siteContentReducer,
    auth: authReducer,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful for passing callbacks to ConfirmModal
    }),
});
