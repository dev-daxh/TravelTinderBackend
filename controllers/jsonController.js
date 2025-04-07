const db = require("../config/firebase");
require("dotenv").config();

const createUser = async (req, res) => {
    try {
        const email = req.body.email;
        const profileImageUrl = req.body.imageUrl;  // Assuming the profile image URL is part of the request body
        console.log('Request body:', req.body);

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Clean the email to make it Firebase-safe (replace dots with underscores)
        const userId = email.replace(/\./g, '_');

        // Reference to the user's data in Realtime Database
        const userRef = db.ref(`users/${userId}`);

        // Check if the user already exists
        const userSnapshot = await userRef.once('value');

        if (userSnapshot.exists()) {
            // User already exists, update the profile image URL
            const existingUser = userSnapshot.val();

            // Update the photos field with the new image URL
            const updatedUser = {
                ...existingUser, // Preserve existing fields
                photos: {
                    profile_img: profileImageUrl,
                },
            };

            // Update the user data in Realtime Database
            await userRef.update(updatedUser);

            console.log('User updated successfully:', updatedUser);

            return res.status(200).json({
                message: 'User updated successfully',
                userId: email,  // Return the user's email as the ID
                photos: updatedUser.photos,
            });
        } else {
            return res.status(404).json({
                message: 'User not found with email',
                userId: email,  // Return the user's email as the ID
            });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { createUser };
