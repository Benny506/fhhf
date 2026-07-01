import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Supabase auth session user
  profile: null, // Custom user profile from fhhf_user_profiles table
  overview: null, // Cached dashboard overview metrics
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setOverview: (state, action) => {
      state.overview = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.overview = null;
    },
  },
});

export const { setUser, setProfile, setOverview, clearAuth } = authSlice.actions;

export default authSlice.reducer;
