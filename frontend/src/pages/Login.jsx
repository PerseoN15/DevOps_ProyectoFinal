// src/pages/Login.jsx
import { useState } from "react";
import API_URL from "../config/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validaciones frontend
    if (!username || !password) {
      setMensaje("Por favor ingresa usuario y contraseña");
      return;
    }

    if (username.length < 3 || password.length < 4) {
      setMensaje(
        "Usuario debe tener al menos 3 caracteres y la contraseña al menos 4"
      );
      return;
    }

    try {
      setCargando(true);

      const resp = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json();

      if (resp.ok && data.ok) {
        // Mensaje que viene del backend: "Inicio de sesión correctamente"
        setMensaje(data.message || "Inicio de sesión correctamente");
      } else {
        setMensaje(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
        >
          {cargando ? "Verificando..." : "Entrar"}
        </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: "16px", textAlign: "center" }}>{mensaje}</p>
      )}
    </div>
  );
}

export default Login;
