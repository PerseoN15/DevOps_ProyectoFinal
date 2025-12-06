// backend/index.js
import express from "express";
import cors from "cors";
import fs from "fs";
import db from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";

// IMPORTANTE: esto hace que se ejecute el constructor y cree la base
import { testUserDB } from "./db/TestUserDB.js";

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

// 👇 Aquí montas las rutas de autenticación en /api
app.use("/api", authRoutes);

let tasks = [
  { id: 1, title: "Taea 2 " },
  { id: 2, title: "Tarea de ejemplo " },
];

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hola desde el backend" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/api/version", (req, res) => {
  const version = getBackendVersion();
  res.json({
    version,
    updatedAt: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log(`Version actual del backend: ${getBackendVersion()}`);
});
