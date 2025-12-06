// backend/controllers/authController.js
import db from "../db/db.js";

// LOGIN
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
        username: row.username,
        email: row.email,
      });
    }
  );
};

// REGISTER
export const registerUser = (req, res) => {
  const { username, password, email } = req.body;

  // Validaciones básicas
  if (!username || !password || !email) {
    return res.status(400).json({
      ok: false,
      message: "Usuario, correo y contraseña son obligatorios",
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      ok: false,
      message: "El usuario debe tener al menos 3 caracteres",
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      ok: false,
      message: "La contraseña debe tener al menos 4 caracteres",
    });
  }

  // Verificar si ya existe usuario o email
  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, row) => {
      if (err) {
        console.error("Error al verificar usuario:", err);
        return res
          .status(500)
          .json({ ok: false, message: "Error interno del servidor" });
      }

      if (row) {
        return res.status(400).json({
          ok: false,
          message: "El usuario o el correo ya está registrado",
        });
      }

      // Insertar nuevo usuario
      db.run(
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
        [username, password, email],
        function (insertErr) {
          if (insertErr) {
            console.error("Error al registrar usuario:", insertErr);
            return res
              .status(500)
              .json({ ok: false, message: "Error al registrar usuario" });
          }

          return res.status(201).json({
            ok: true,
            message: "Registro exitoso",
            username,
            email,
          });
        }
      );
    }
  );
};
