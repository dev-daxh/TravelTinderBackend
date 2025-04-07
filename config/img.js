
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: 'dkibt7upb', 
    api_key: '193663597745125', 
    api_secret: 'tGPsefb8KNqHdlDZOtcEP5g3PMk' 
});

module.exports = cloudinary;
