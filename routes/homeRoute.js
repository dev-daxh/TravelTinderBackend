const express = require("express");


const router = express.Router();
const multer = require('multer');

const { getProfile,getMatchingData } = require("../controllers/homeContoller");

// Set up multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/getProfile",getProfile);
router.post('/getmatchdata',getMatchingData);
module.exports = router;
