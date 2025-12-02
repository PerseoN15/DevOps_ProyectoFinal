import React, { useState } from "react";
import API_URL from "../config/api";
import "./Login.css";

function Login() {
  const [activeModal, setActiveModal] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

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
        setTimeout(() => {
          setActiveModal(null);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!username || !password || !email || !confirmPassword) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    if (username.length < 3) {
      setMensaje("El usuario debe tener al menos 3 caracteres");
      return;
    }

    if (password.length < 4) {
      setMensaje("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      setCargando(true);

      const resp = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await resp.json();

      if (resp.ok && data.ok) {
        setMensaje(data.message || "Registro exitoso");
        setTimeout(() => {
          setActiveModal(null);
          setMensaje("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setEmail("");
        }, 2000);
      } else {
        setMensaje(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setMensaje("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setCargando(false);
  };

  return (
    <div className="welcome-container">
      {/* Fondo animado con partículas */}
      <div className="animated-background">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Elementos decorativos circulares */}
      <div className="decorative-element"></div>
      <div className="decorative-element"></div>
      <div className="decorative-element"></div>
      <div className="decorative-element"></div>

      {/* Contenido principal */}
      <div className="welcome-content">
        <header className="welcome-header">
          <h1 className="main-title">Sistema de Tutorías</h1>
          <p className="subtitle">Plataforma educativa integral para estudiantes y tutores</p>
        </header>

        <div className="welcome-card">
          <h2 className="welcome-message">¡Bienvenuudo!</h2>
          <p className="welcome-description">
            Accede a tu cuenta o regístrate para comenzar a utilizar todas las funcionalidades del sistema.
          </p>

          <div className="button-container">
            <button 
              className="welcome-button login-btn"
              onClick={() => setActiveModal('login')}
            >
              Iniciar Sesión
            </button>
            <button 
              className="welcome-button register-btn"
              onClick={() => setActiveModal('register')}
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
      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para acceder al sistema</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="modal-form">
              <div className="form-group">
                <div className="input-container">
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="login-username" className="form-label">Usuario</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="login-password" className="form-label">Contraseña</label>
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
                className={`submit-button ${cargando ? 'loading' : ''}`}
              >
                <span className="button-text">
                  {cargando ? "Verificando..." : "Iniciar Sesión"}
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
              <p>¿No tienes cuenta? <a href="#register" onClick={(e) => { e.preventDefault(); setActiveModal('register'); }}>Regístrate aquí</a></p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro */}
      {activeModal === 'register' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>Crear Cuenta</h2>
              <p>Regístrate para comenzar a usar el sistema</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="modal-form">
              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="register-username" className="form-label">Usuario</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="register-email" className="form-label">Email</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="register-password" className="form-label">Contraseña</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="register-confirm-password" className="form-label">Confirmar Contraseña</label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`submit-button ${cargando ? 'loading' : ''}`}
              >
                <span className="button-text">
                  {cargando ? "Registrando..." : "Crear Cuenta"}
                </span>
                <div className="button-loader"></div>
              </button>
            </form>

            {mensaje && (
              <div className={`message ${mensaje.includes("exitoso") ? 'success' : 'error'}`}>
                {mensaje}
              </div>
            )}

            <div className="modal-footer">
              <p>¿Ya tienes cuenta? <a href="#login" onClick={(e) => { e.preventDefault(); setActiveModal('login'); }}>Inicia sesión aquí</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;