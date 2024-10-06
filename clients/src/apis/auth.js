import axios from 'axios';
import { toast } from 'react-toastify';

// Axios instance with Authorization token
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

let url = process.env.REACT_APP_SERVER_URL;

// Login User API
export const loginUser = async (body) => {
  try {
    return await axios.post(`${url}/auth/login`, body);
  } catch (error) {
    console.error('Error in loginUser API:', error);
    toast.error('Login failed. Please try again.');
  }
};

// Google Authentication API
export const googleAuth = async (body) => {
  try {
    return await axios.post(`${url}/api/google`, body);
  } catch (error) {
    console.error('Error in googleAuth API:', error);
    toast.error('Google authentication failed. Please try again.');
  }
};

// Register User API
export const registerUser = async (body) => {
  try {
    return await axios.post(`${url}/auth/register`, body);
  } catch (error) {
    console.error('Error in registerUser API:', error);
    toast.error('Registration failed. Please try again.');
  }
};

// Validate User Token API
export const validUser = async () => {
  try {
    const token = localStorage.getItem('userToken');

    const { data } = await API(token).get(`/auth/valid`, {
      headers: { Authorization: token },
    });
    return data;
  } catch (error) {
    console.error('Error in validUser API:', error);
    toast.error('Validation failed. Please login again.');
  }
};

// Search Users API
export const searchUsers = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    return await API(token).get(`/api/user?search=${id}`);
  } catch (error) {
    console.error('Error in searchUsers API:', error);
    toast.error('User search failed. Please try again.');
  }
};

// Update User API
export const updateUser = async (id, body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch(`/api/users/update/${id}`, body);
    return data;
  } catch (error) {
    console.error('Error in updateUser API:', error);
    toast.error('Update failed. Please try again.');
  }
};

// Check Validity of User
export const checkValid = async () => {
  try {
    const data = await validUser();
    if (!data?.user) {
      toast.warning('Session expired. Please log in again.');
      window.location.href = '/login';
    } else {
      window.location.href = '/chats';
    }
  } catch (error) {
    console.error('Error in checkValid function:', error);
    toast.error('Failed to validate user session.');
  }
};
