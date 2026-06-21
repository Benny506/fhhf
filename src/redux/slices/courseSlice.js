import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  instructorCourses: null, // null indicates not fetched yet, array indicates fetched
  enrolledCourses: null,
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setInstructorCourses: (state, action) => {
      state.instructorCourses = action.payload;
    },
    clearInstructorCourses: (state) => {
      state.instructorCourses = null;
    },
    removeCourseLocally: (state, action) => {
      if (state.instructorCourses) {
        state.instructorCourses = state.instructorCourses.filter(c => c.id !== action.payload);
      }
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
  },
});

export const { setInstructorCourses, clearInstructorCourses, removeCourseLocally, setEnrolledCourses } = courseSlice.actions;

export default courseSlice.reducer;
