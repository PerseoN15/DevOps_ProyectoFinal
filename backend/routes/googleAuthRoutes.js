// backend/routes/googleAuthRoutes.js
const express = require("express");
const { loginWithGoogle } = require("../controllers/authGoogleController");

const router = express.Router();

// El frontend manda POST /api/auth/google con { credential }
router.post("/google", loginWithGoogle);

module.exports = router;
