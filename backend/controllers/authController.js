import { connectDB } from "../db/mongo.js";

// LOGIN
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "Usuario y contraseña son obligatorios",
    });
  }

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    return res.json({
      ok: true,
      message: "Inicio de sesión correctamente",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

// REGISTER
export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      ok: false,
      message: "Usuario, correo y contraseña son obligatorios",
    });
  }

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const existing = await users.findOne({
      $or: [{ username }, { email }],
    });

    if (existing) {
      return res.status(400).json({
        ok: false,
        message: "El usuario o el correo ya está registrado",
      });
    }

    await users.insertOne({
      username,
      password,
      email,
      provider: "local",
      provider_id: null,
      createdAt: new Date(),
    });

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
