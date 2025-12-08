const express = require("express");
const router = express.Router();
const controller = require("../controllers/googleAuthController");

router.get("/google/callback", controller.googleCallback);

module.exports = router;
