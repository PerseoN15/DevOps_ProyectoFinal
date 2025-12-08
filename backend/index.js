const express = require("express");
const cors = require("cors");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes.js");
const googleAuthRoutes = require("./routes/googleAuthRoutes.js");
const { testConnection, pool } = require("./db/dbMySql.js");

const app = express();
const PORT = 4000;

const VERSION_FILE = "./backend_version.txt";

function getBackendVersion() {
  try {
    const raw = fs.readFileSync(VERSION_FILE, "utf8");
    return raw.trim() || "1";
  } catch (err) {
    console.warn(
      "No se pudo leer backend_version.txt, usando version 1 por defecto"
    );
    return "1";
  }
}

// Health check endpoint para CI/CD
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(cors());
app.use(express.json());

// Rutas de auth normal (login, registro, etc)
app.use("/api", authRoutes);

// Rutas de auth con Google -> POST /api/auth/google
app.use("/api/auth", googleAuthRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" });
});

app.get("/api/test-mysql", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    return res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/version", (req, res) => {
  const version = getBackendVersion();
  res.json({
    version,
    updatedAt: new Date().toISOString(),
  });
});

app.listen(PORT, async () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log(`Version actual del backend: ${getBackendVersion()}`);
  await testConnection();
});
