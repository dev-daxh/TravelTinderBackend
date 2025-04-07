const express = require("express");
const {  getChatMainData,} = require("../controllers/chatController");

const router = express.Router();
const multer = require('multer');
const { get } = require("mongoose");

// Set up multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/get-chat-main",getChatMainData);
// router.post("/user-message",ChatController);
module.exports = router;
