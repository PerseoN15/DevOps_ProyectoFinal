// backend/controllers/authController.js
import db from "../db/db.js";

// Controlador para manejar el login
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Validaciones básicas
  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "Usuario y contraseña son obligatorios",
    });
  }

  if (username.length < 3 || password.length < 4) {
    return res.status(400).json({
      ok: false,
      message:
        "Usuario debe tener al menos 3 caracteres y la contraseña al menos 4",
    });
  }

  // Buscar usuario en SQLite
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error("Error al consultar usuario:", err);
        return res
          .status(500)
          .json({ ok: false, message: "Error interno del servidor" });
      }

      if (!row) {
        return res
          .status(401)
          .json({ ok: false, message: "Usuario o contraseña incorrectos" });
      }

      // Login correcto
      return res.json({
        ok: true,
        message: "Inicio de sesión correctamente",
      });
    }
  );
};
