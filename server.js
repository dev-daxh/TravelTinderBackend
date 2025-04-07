require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoute');
const userRoute = require('./routes/userProfileRoute');
const authPayment = require('./routes/authPayment');
const jsonRoute = require('./routes/jsonRoute');
const chatRoute = require('./routes/chatRoute');
const postRoute = require('./routes/postRoute');
const homeRoute = require('./routes/homeRoute');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploads = 'uploads';
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Allow your frontend's URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });
app.get('/chat', (req, res) => {
  res.send('Chat server is running');
});
// Handling real-time chat
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for messages from the client
  socket.on('sendMessage', (message) => {
      console.log('Received message:', message);
      
      // Broadcast the message to all clients
      io.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});
// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  methods: ['GET', 'POST'], // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute); // Ensure the /api/user route is correctly mapped
app.use('/api/uploads', express.static(path.join(__dirname, uploads)));
app.use('/api/explore', authRoutes);
app.use('/api/payment', authPayment);
app.use('/api/json', jsonRoute);
app.use('/api/post', postRoute);
app.use('/api/chat', chatRoute);
app.use('/api/home',homeRoute);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

