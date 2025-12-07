// backend/index.js
import express from "express";
import cors from "cors";
import fs from "fs";




// Rutas de autenticación (login / register)
import authRoutes from "./routes/authRoutes.js";
const { testConnection } = require('./db/dbMySql.js');

const app = express();
const PORT = 4000;

const VERSION_FILE = "./backend_version.txt";

function getBackendVersion() {
  try {
    const raw = fs.readFileSync(VERSION_FILE, "utf8");
    return raw.trim() || "1";
  } catch (err) {
    console.warn(
      "No se pudo leer backend_version.txt, usando versión 1 por defecto"
    );
    return "1";
  }
}

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

// Datos de ejemplo para /api/tasks
let tasks = [
  { id: 1, title: "Taea 2 " },
  { id: 2, title: "Tarea de ejemplo " },
];
app.listen(PORT, async () => {
  console.log(`Backend en puerto ${PORT}`);
  await testConnection();
});

// Ruta raíz simple
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// Ruta de prueba básica
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" });
});
app.get('/api/test-mysql', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    return res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Ruta de tareas de ejemplo
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Ruta para ver la versión del backend
app.get("/api/version", (req, res) => {
  const version = getBackendVersion();
  res.json({
    version,
    updatedAt: new Date().toISOString(),
  });
});




// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log(`Version actual del backend: ${getBackendVersion()}`);
});
