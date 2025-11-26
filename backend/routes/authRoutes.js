// backend/routes/authRoutes.js
import { Router } from "express";
import { loginUser } from "../controllers/authController.js";

const router = Router();

router.post("/login", loginUser); // /api/login

export default router;
