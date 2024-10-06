import { createSlice } from '@reduxjs/toolkit';

// Initial state for the active user
const initialState = {
  id: '',
  email: '',
  profilePic: '',
  bio: '',
  name: '',
};

// Creating the slice
const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    // Set all user properties
    setActiveUser: (state, { payload }) => {
      state.id = payload.id;
      state.email = payload.email;
      state.profilePic = payload.profilePic;
      state.bio = payload.bio;
      state.name = payload.name;
    },
    // Update only the user's name and bio
    setUserNameAndBio: (state, { payload }) => {
      state.name = payload.name;
      state.bio = payload.bio;
    },
  },
});

// Exporting the actions to use in components
export const { setActiveUser, setUserNameAndBio } = activeUserSlice.actions;

// Selector to get active user data
export const selectActiveUser = (state) => state.activeUser;

// Exporting the reducer to be used in the store
export default activeUserSlice.reducer;
