const express = require('express');
const db = require('../config/firebase');

//const Message = require('../models/messageModel');

const getChatMainData = async (req, res) => {
    try {
      // Reference to the users' profiles in Realtime Database
      const usersRef = db.ref('users');
  
      // Fetch all users' profiles from Firebase
      const usersSnapshot = await usersRef.once('value');
      
      if (!usersSnapshot.exists()) {
        console.log('No profiles found');
        return res.status(404).json({ message: 'No profiles found' });
      }
  
      // Extract the user profiles data
      const usersData = usersSnapshot.val();
      console.log('All users data done');
  
      // Return the profiles data in the response
      return res.status(200).json({ profiles: usersData });
    
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


  // class ChatController {
  //   static handleUserMessage(socket, message) {
  //     // Create a new message object (model)
  //     const newMessage = new Message(message);
  
  //     // Emit message to all connected clients
  //     socket.broadcast.emit('message', newMessage); // broadcast to all clients except the sender
  
  //     // Optionally log the message to the console for debugging purposes
  //     console.log(`New message received: ${newMessage.content} at ${newMessage.timestamp}`);
  //   }
  // }




module.exports = {
  getChatMainData,
  //ChatController
  };