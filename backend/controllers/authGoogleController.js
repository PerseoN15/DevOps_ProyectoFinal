// backend/controllers/authGoogleController.js
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function loginWithGoogle(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ message: "Falta credential de Google" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const user = {
      id: googleId,
      nombre: name,
      email,
      rol: "Alumno",
      avatar: picture,
    };

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login con Google exitoso",
      token,
      user,
    });
  } catch (error) {
    console.error("Error en loginWithGoogle:", error);
    return res
      .status(500)
      .json({ message: "Error al iniciar sesión con Google" });
  }
}

module.exports = { loginWithGoogle };
