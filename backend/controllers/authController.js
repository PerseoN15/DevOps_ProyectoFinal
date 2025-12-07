const { pool } = require('../db/dbMySql.js');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "Usuario/Email y contrasena son obligatorios",
    });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Usuario/Email o contrasena incorrectos",
      });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Usuario/Email o contrasena incorrectos",
      });
    }

    return res.json({
      ok: true,
      message: "Inicio de sesion correctamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        fecha_nacimiento: user.fecha_nacimiento,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

const registerUser = async (req, res) => {
  const { username, password, email, nombre, fecha_nacimiento, role } = req.body;

  if (!username || !password || !email || !nombre || !fecha_nacimiento) {
    return res.status(400).json({
      ok: false,
      message: "Todos los campos son obligatorios",
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
      message: "La contrasena debe tener al menos 4 caracteres",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      ok: false,
      message: "Email invalido",
    });
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "El usuario o el correo ya esta registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, password, email, nombre, fecha_nacimiento, role, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [username, hashedPassword, email, nombre, fecha_nacimiento, role || 'alumno']
    );

    return res.status(201).json({
      ok: true,
      message: "Registro exitoso",
      username,
      email,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = { loginUser, registerUser };