import axios from 'axios';
import { toast } from 'react-toastify';

// Axios instance with Authorization token
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

// Create Access API
export const acessCreate = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat', body);
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error in access create API:', error);
    toast.error('Failed to create chat. Please try again.');
  }
};

// Fetch All Chats API
export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get('/api/chat');
    return data;
  } catch (error) {
    console.error('Error in fetch all chats API:', error);
    toast.error('Failed to fetch chats. Please try again.');
  }
};

// Create Group API
export const createGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat/group', body);
    toast.success(`${data.chatName} group created successfully!`);
    return data;
  } catch (error) {
    console.error('Error in create group API:', error);
    toast.error('Failed to create group. Please try again.');
  }
};

// Add to Group API
export const addToGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/groupAdd', body);
    toast.success('User added to the group successfully.');
    return data;
  } catch (error) {
    console.error('Error in add to group API:', error);
    toast.error('Failed to add user to group. Please try again.');
  }
};

// Rename Group API
export const renameGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/group/rename', body);
    toast.success(`Group renamed to ${data.newName} successfully!`);
    return data;
  } catch (error) {
    console.error('Error in rename group API:', error);
    toast.error('Failed to rename group. Please try again.');
  }
};

// Remove User from Group API
export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/groupRemove', body);
    toast.success('User removed from the group successfully.');
    return data;
  } catch (error) {
    console.error('Error in remove user API:', error);
    toast.error('Failed to remove user from group. Please try again.');
  }
};
