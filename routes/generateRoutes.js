const express = require("express");
const router = express.Router();
const { generateContent } = require("../controllers/generateController");
const {saveContent} = require("../controllers/generateController");
router.post("/generate", generateContent);
const authenticateJWT = require("../middleware/authenticateJWT");
// Save / schedule post
router.post("/addpost", authenticateJWT, saveContent);
//post now

module.exports = router;
