import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 4000;

// Archivo donde guardamos la versión del backend
const VERSION_FILE = "./backend_version.txt";

// Función para leer la versión actual
function getBackendVersion() {
  try {
    const raw = fs.readFileSync(VERSION_FILE, "utf8");
    return raw.trim() || "1";
  } catch (err) {
    console.warn("No se pudo leer backend_version.txt, usando versión 1 por defecto");
    return "1";
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo en memoria
let tasks = [
  { id: 1, title: "Taea 2 " },
  { id: 2, title: "Tarea de ejemplo " },
];

// Endpoint raíz para probar conexión
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// Endpoint de prueba
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" });
});

// Endpoint que usa tu App.jsx
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// NUEVO: endpoint para que el frontend pueda saber la versión actual
app.get("/api/version", (req, res) => {
  const version = getBackendVersion();
  res.json({
    version,
    updatedAt: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log(`Versión actual del backend: ${getBackendVersion()}`);
});
