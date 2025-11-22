// [BACKEND] backend/index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Datos en memoria
let tasks = [];
let currentId = 1;

// Ruta de prueba
app.get("/", (req, res) => {
  console.log("Se llamó a GET /"); // para ver en consola
  res.json({ message: "Funciona" });
});

// Obtener todas las tareas
app.get("/api/tasks", (req, res) => {
  console.log("Se llamó a GET /api/tasks");
  res.json(tasks);
});

// Crear tarea
app.post("/api/tasks", (req, res) => {
  console.log("Se llamó a POST /api/tasks", req.body);
  const { title, description, status, dueDate } = req.body;

  const newTask = {
    id: currentId++,
    title,
    description,
    status: status || "pendiente",
    dueDate: dueDate || null,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Editar tarea
app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, status, dueDate } = req.body;

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  tasks[index] = {
    ...tasks[index],
    title: title ?? tasks[index].title,
    description: description ?? tasks[index].description,
    status: status ?? tasks[index].status,
    dueDate: dueDate ?? tasks[index].dueDate,
  };

  res.json(tasks[index]);
});

// Eliminar tarea
app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  const deleted = tasks[index];
  tasks.splice(index, 1);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
