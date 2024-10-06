import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchAllChats } from '../apis/chat';

const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
};

export const fetchChats = createAsyncThunk('redux/chats', async (_, thunkAPI) => {
  try {
    const data = await fetchAllChats();
    return data;
  } catch (error) {
    toast.error('Something Went Wrong! Try Again');
    return thunkAPI.rejectWithValue(error.message); // Return error message
  }
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChats.fulfilled, (state, { payload }) => {
        state.chats = payload;
        state.isLoading = false;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Selector functions
export const selectChats = (state) => state.chats.chats;
export const selectActiveChat = (state) => state.chats.activeChat;
export const selectIsLoading = (state) => state.chats.isLoading;
export const selectNotifications = (state) => state.chats.notifications;

export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;
