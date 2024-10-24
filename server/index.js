import express from 'express';
import dotenv from 'dotenv/config';
import mongoDBConnect from './mongoDB/connection.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import * as Server from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration to allow your frontend (on Vercel or localhost)
const corsConfig = {
  origin: process.env.BASE_URL || 'http://localhost:3000',  // Ensure this matches your frontend's URL
  credentials: true,
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));

// Preflight request handling for CORS
app.options('*', cors(corsConfig));

// Routes
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// MongoDB connection
mongoose.set('strictQuery', false);
mongoDBConnect();

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});

// WebSocket server setup with proper CORS configuration
const io = new Server.Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  // When a user connects to the socket
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });

  // User joins a room (chat)
  socket.on('join room', (room) => {
    socket.join(room);
  });

  // Typing events
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  // New message event
  socket.on('new message', (newMessageReceive) => {
    const chat = newMessageReceive.chatId;

    if (!chat.users) {
      console.log('chat.users is not defined');
      return;
    }

    // Notify all users in the chat except the sender
    chat.users.forEach((user) => {
      if (user._id === newMessageReceive.sender._id) return;
      socket.in(user._id).emit('message received', newMessageReceive);
    });
  });
});
