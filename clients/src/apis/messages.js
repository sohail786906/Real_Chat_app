import axios from 'axios';

// Axios instance for API requests with Authorization header
const API = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { Authorization: token },
  });

// Send Message API
export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/message/', body);
    return data;
  } catch (error) {
    console.error('Error in send message API:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// Fetch Messages API
export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.error('Error in fetch message API:', error);
    throw new Error('Failed to fetch messages. Please try again.');
  }
};
