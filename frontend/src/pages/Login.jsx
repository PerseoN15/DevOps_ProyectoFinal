import React, { useState } from "react";
import API_URL from "../config/api";
import "./WelcomePage.css"; // Archivo CSS para los estilos

function WelcomePage() {
  const [showLogin, setShowLogin] = useState(false);
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
        // Aquí podrías redirigir después de un login exitoso
        setTimeout(() => {
          setShowLogin(false);
          setMensaje("");
        }, 2000);
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
    <div className="welcome-container">
      {/* Fondo animado */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="welcome-content">
        <header className="welcome-header">
          <h1 className="main-title">Sistema de Tutorías</h1>
          <p className="subtitle">Plataforma educativa integral para estudiantes y tutores</p>
        </header>

        <div className="welcome-card">
          <h2 className="welcome-message">¡Bienvenido!</h2>
          <p className="welcome-description">
            Accede a tu cuenta o regístrate para comenzar a utilizar todas las funcionalidades del sistema.
          </p>

          <div className="button-container">
            <button 
              className="welcome-button login-btn"
              onClick={() => setShowLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button 
              className="welcome-button register-btn"
              onClick={() => alert("Funcionalidad de registro en desarrollo")}
            >
              Registrarse
            </button>
          </div>
        </div>

        <footer className="welcome-footer">
          <p>¿Necesitas ayuda? <a href="#contact">Contáctanos</a></p>
        </footer>
      </div>

      {/* Modal de Login */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <div className="login-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder al sistema</p>
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

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Recordar sesión</span>
                </label>
                <a href="#forgot" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
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

            <div className="modal-footer">
              <p>¿No tienes cuenta? <a href="#register">Regístrate aquí</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;