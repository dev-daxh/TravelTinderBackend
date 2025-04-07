const express = require("express");
const { sendOTP, googleauthController } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOTP);
module.exports = router;
