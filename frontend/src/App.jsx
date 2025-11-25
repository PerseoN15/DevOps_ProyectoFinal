import React from "react";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


function App() {
  const [mensaje, setMensaje] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Probar el endpoint raíz "/"
        const resRoot = await fetch(`${API_URL}/`);
        const dataRoot = await resRoot.json();
        setMensaje(dataRoot.message); // debería ser "API funcionando"

        // 2. Obtener tareas de "/api/tasks"
        const resTasks = await fetch(`${API_URL}/api/tasks`);
        const dataTasks = await resTasks.json();
        setTasks(dataTasks);
      } catch (error) {
        console.error("Error llamando a la API:", error);
        setMensaje("Error conectando con la API");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#0f172a", color: "#e5e7eb" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Frontend conectado al Backend 🚀</h1>

      {loading ? (
        <p>Cargando datos desde la API...</p>
      ) : (
        <>
          <h2>Mensaje del backend:</h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>{mensaje}</p>

          <h2>Lista de tareas:</h2>
          {tasks.length === 0 ? (
            <p>No hay tareas registradas.</p>
          ) : (
            <ul>
              {tasks.map((t) => (
                <li key={t.id}>
                  {t.id}. {t.title}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;
