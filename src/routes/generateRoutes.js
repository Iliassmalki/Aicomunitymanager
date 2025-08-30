const express = require("express");
const router = express.Router();
const { generateContent } = require("../controllers/generateController");
const { protect } = require("../middlewares/authMiddleware");

// protège pour lier userId (sinon ce sera null)
router.post("/", protect, generateContent);
// pour tester vite sans auth, utilise: router.post("/", generateContent);

module.exports = router;
