const express = require("express");
const {  uploadPost,uploadimg,getPosts,getProfile } = require("../controllers/postController");

const router = express.Router();
const multer = require('multer');

// Set up multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/new-post",uploadPost );
router.get("/get-post",getPosts );
router.get("/get-profile",getProfile);
router.post("/upload-img",upload.single('image'),uploadimg );

module.exports = router;
