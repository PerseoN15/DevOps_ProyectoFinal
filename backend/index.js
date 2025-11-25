import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

// Para que el frontend (puerto 80) pueda llamar al backend (4000)
app.use(cors());
app.use(express.json());

// Datos de ejemplo en memoria
let tasks = [
  { id: 1, title: "Tarea 1" },
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend en puerto ${PORT}`);
});
