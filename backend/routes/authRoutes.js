import express from "express";
import { testUserDB } from "../db/TestUserDB.js";

const router = express.Router();

router.post("/login-test", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await testUserDB.getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.json({
      message: "Login correcto (usuario de prueba en SQLite en AWS)",
      username: user.username,
    });
  } catch (error) {
    console.error("Error en /login-test:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
