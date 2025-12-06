// backend/routes/authRoutes.js
import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/login
router.post("/login", loginUser);

// POST /api/register
router.post("/register", registerUser);

export default router;
