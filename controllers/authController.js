require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const passport = require("../config/passportConfig");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Send OTP Function
async function sendOTP(req, res) {
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const info = await transporter.sendMail({
      from: `"Travel Tinder" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Travel Tinder Email Verification 🗺️",
      text: `Your OTP for verification is: ${otpCode}`,
    });

    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({ messageId: info.messageId, otp: otpCode });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP." });
  }
}

// Google Authentication Controller
const googleauthController = {
  getGoogleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

  getGoogleCallback: [
    passport.authenticate("google", { failureRedirect: "/auth-main" }),
    (req, res) => {
      const user = req.user;

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing");
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.emails[0].value },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Send email and token to frontend using `window.opener.postMessage`
      res.send(`
        <script>
          window.opener.postMessage(${JSON.stringify({ email: user.emails[0].value, token })}, "http://localhost:5173/terms");
          window.close();
        </script>
      `);
      //testing
    },
  ],


  getProfile: (req, res) => {
    if (!req.user) return res.redirect("/auth-main");
    res.send(`Welcome`);
  },

  logout: (req, res) => {
    req.logout(() => {
      res.redirect("/auth-main");
    });
  },
};

module.exports = { sendOTP, googleauthController };
