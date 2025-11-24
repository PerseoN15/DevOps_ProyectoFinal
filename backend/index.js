// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// Otro endpoint de ejemplo
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    backend: "DevOps_ProyectoFinal",
    time: new Date().toISOString(),
  });
});

// Importante: escuchar en 0.0.0.0 para que EC2 acepte conexiones externas
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend iniciado en puerto ${PORT}`);
});
