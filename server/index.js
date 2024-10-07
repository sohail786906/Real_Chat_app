import express from 'express';
import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoDBConnect from './mongoDB/connection.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS Configuration
const corsOptions = {
  origin: process.env.BASE_URL, // Ensure this matches your frontend URL
  credentials: true,
};

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// API Routes
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoDBConnect()
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start the Server
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

// Socket.io Setup
const io = new Server(server, {
  pingTimeout: 60000, // Disconnect after 60 seconds of inactivity
  cors: {
    origin: process.env.BASE_URL || 'https://real-chat-app-iota.vercel.app/', // Update origin as needed
    credentials: true,
  },
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('A user connected');

  // User Setup
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
    console.log(`${userData.id} joined the room`);
  });

  // Join Room
  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Typing & Stop Typing Events
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  // New Message
  socket.on('new message', (newMessageRecieve) => {
    const chat = newMessageRecieve.chatId;

    if (!chat.users) {
      console.error('chat.users is not defined');
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieve.sender._id) return;
      socket.in(user._id).emit('message received', newMessageRecieve);
    });
  });

  // Disconnect Event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
