const db = require('../config/firebase');
const path = require('path');

const cloudinary = require('../config/img');
const multer = require('multer');

const allowedExtensions = ['.jpg', '.jpeg', '.png'];
// Configure Multer to store file in memory

// Configure Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 1 * 1024 * 1024 // Limit to 1MB (1 * 1024 * 1024 bytes)
  }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});


const uploadPost = async (req, res) => {
    try {
        // Log the incoming request body
        console.log('Incoming request body:', req.body);

        const email = req.body.email;
        const profileImageUrl = req.body.imageUrl;  // The image URL passed in the request body
        const caption = req.body.caption;  // The caption passed in the request body

        // Check if email is provided
        if (!email) {
            console.error('No email provided in request body');
            return res.status(400).json({ error: 'Email is required' });
        }
        
        console.log('Email received:', email);
        
        // Clean the email to make it Firebase-safe (replace dots with underscores)
        const userId = email.replace(/\./g, '_');
        console.log('Cleaned user ID:', userId);

        // Reference to the user's data in Realtime Database
        const userRef = db.ref(`users/${userId}`);

        // Log the reference to the database
        console.log('User reference:', userRef.toString());

        // Check if the user already exists
        const userSnapshot = await userRef.once('value');
        console.log('User snapshot exists:', userSnapshot.exists());

        if (userSnapshot.exists()) {
            // User already exists, update the post data with the new image URL, caption, and timestamp
            const existingUser = userSnapshot.val();
            console.log('Existing user data:', existingUser);

            // Generate a unique key for the new post (e.g., 'p1', 'p2', 'p3' or generate a random ID)
            const postKey = `p${Object.keys(existingUser.post || {}).length + 1}`;
            console.log('Generated post key:', postKey);

            // Create a unique image key (e.g., "image1", "image2", etc.)
            const imageKey = `image_${Date.now()}`;  // Use the timestamp as the key for the image
            console.log('Generated image key:', imageKey);

            // Update the posts field with the new post data
            const updatedUser = {
                ...existingUser, // Preserve existing fields
                post: {
                    ...existingUser.post, // Keep existing posts
                    [postKey]: {
                        "imageUrl": profileImageUrl, // Store the image URL with a unique image key
                        caption: caption,  // Store the caption
                        timestamp: Date.now(), // Store the timestamp
                    }
                },
            };

            // Log the updated user data
            console.log('Updated user data:', updatedUser);

            // Update the user data in Realtime Database
            await userRef.update(updatedUser);
            console.log('User data successfully updated in Firebase');

            // Return the response
            return res.status(200).json({
                message: 'User updated successfully',
                userId: email,  // Return the user's email as the ID
                post: updatedUser.post,  // Return the updated post data
            });
        } else {
            console.error('User not found with email:', email);
            return res.status(404).json({
                message: 'User not found with email',
                userId: email,  // Return the user's email as the ID
            });
        }

    } catch (error) {
        console.error('Error during post upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPosts = async (req, res) => {
    try {
        //take email from query
        console.log('Incoming request query:', req.query);
        // Log the incoming request query
        
        const email = req.query.email;  // Get the email from the query parameters
        console.log('Email received from query:', email);   
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Clean the email to make it Firebase-safe (replace dots with underscores)
        const userId = email.replace(/\./g, '_');
        console.log('Fetching posts for user:', userId);

        // Reference to the user's posts in Realtime Database
        const userRef = db.ref(`users/${userId}/post`);

        // Fetch the user's posts from Firebase
        const postsSnapshot = await userRef.once('value');

        if (!postsSnapshot.exists()) {
            console.log('No posts found for user:', userId);
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        // Extract the posts data
        const posts = postsSnapshot.val();
        console.log('Posts data:', posts);

        // Return the posts in the response
        return res.status(200).json({ posts });
        
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
      const email = req.query.email;  // Get the email from the query parameters
      console.log('Email received from query:', email);
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Clean the email to make it Firebase-safe (replace dots with underscores)
      const userId = email.replace(/\./g, '_');
      console.log('Fetching profile for user:', userId);
  
      // Reference to the user's profile in Realtime Database
      const userProfileRef = db.ref(`users/${userId}`);
  
      // Fetch the user's profile from Firebase
      const userProfileSnapshot = await userProfileRef.once('value');
  
      if (!userProfileSnapshot.exists()) {
        console.log('No profile found for user:', userId);
        return res.status(404).json({ message: 'Profile not found for this user' });
      }
  
      // Extract the profile data
      const userProfile = userProfileSnapshot.val();
      console.log('User profile data:', userProfile);
  
      // Return the profile data in the response
      return res.status(200).json({ profile: userProfile });
  
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const uploadimg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const newFileName = `${req.body.email}_post_${Date.now()}`;

        // Upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                public_id: newFileName,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'Upload failed' });
                }

                // Successful upload
                console.log('Asset ID: ' + result.asset_id);
                console.log('Image URL: ' + result.secure_url);

                // Respond with success and include image URL and asset ID
                return res.status(200).json({
                    success: true,
                    imageUrl: result.secure_url,
                    assetId: result.asset_id,
                });
            }
        );

        uploadStream.end(req.file.buffer);  // Send file buffer to Cloudinary
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

module.exports = { uploadPost,uploadimg, getProfile,getPosts };