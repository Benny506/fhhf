import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoaded: false,
  data: {
    home: null,
    about: null,
    contact: null
  }
};

const siteContentSlice = createSlice({
  name: 'siteContent',
  initialState,
  reducers: {
    setSiteContent: (state, action) => {
      // action.payload will be the array of rows from db
      const contentMap = { home: {}, about: {}, contact: {} };
      
      action.payload.forEach(row => {
        const { page_name, section_key, content } = row;
        if (!contentMap[page_name]) {
          contentMap[page_name] = {};
        }
        contentMap[page_name][section_key] = content;
      });

      state.data = contentMap;
      state.isLoaded = true;
    }
  }
});

export const { setSiteContent } = siteContentSlice.actions;
export default siteContentSlice.reducer;
