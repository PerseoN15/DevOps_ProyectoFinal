import React, { useState } from "react";
import API_URL from "../config/api";
import "./Login.css"; // Archivo CSS para los estilos

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
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <h1 className="welcome-title">Bienvenidos al Sistema de Tutorías</h1>
          <p className="welcome-subtitle">Por favor, inicie sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-container">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder=" "
              />
              <label htmlFor="username" className="form-label">Usuario</label>
              <div className="input-underline"></div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder=" "
              />
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="input-underline"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className={`login-button ${cargando ? 'loading' : ''}`}
          >
            <span className="button-text">
              {cargando ? "Verificando..." : "Entrar"}
            </span>
            <div className="button-loader"></div>
          </button>
        </form>

        {mensaje && (
          <div className={`message ${mensaje.includes("correctamente") ? 'success' : 'error'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;