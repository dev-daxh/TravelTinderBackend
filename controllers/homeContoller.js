const express = require('express');
const db = require('../config/firebase');


const getProfile = async (req, res) => {
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
  

  const getMatchingData= async (req, res) => {
    try {
      // Get current user's email from query params or from the request body
      const { email } = req.body;  // Assuming email is passed as a URL parameter
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      // Reference to the users' profiles in Firebase Realtime Database
      const usersRef = db.ref('users');
      
      // Fetch all user profiles from Firebase
      const usersSnapshot = await usersRef.once('value');
  
      if (!usersSnapshot.exists()) {
        console.log('No profiles found');
        return res.status(404).json({ message: 'No profiles found' });
      }
  
      // Extract the users data from the snapshot
      const usersData = usersSnapshot.val();
  
      // Find the current user's profile
      const currentUserProfile = usersData[email.replace('.', '_')] // Transform email to match Firebase path
      if (!currentUserProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      
      // Return the profile and preferences for the current user
      console.log('user prefrence data is sending to response')
      return res.status(200).json({
        
        travelPreferencesv1: currentUserProfile.travelPreferencesv1,
        travelPreferencesv2: currentUserProfile.travelPreferencesv2
      });
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
  getProfile,getMatchingData
};