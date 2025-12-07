import React, { useState } from "react";
import API_URL from "../config/api";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [activeModal, setActiveModal] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [registerRole, setRegisterRole] = useState("alumno");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!username || !password) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    if (username.length < 3 || password.length < 4) {
      setMensaje(
        "Usuario debe tener al menos 3 caracteres y la contrasena al menos 4"
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
        setMensaje(data.message || "Inicio de sesion correctamente");
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          setActiveModal(null);
          setMensaje("");
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        }, 1500);
      } else {
        setMensaje(data.message || "Usuario o contrasena incorrectos");
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

    if (!username || !password || !email || !confirmPassword || !nombre || !fechaNacimiento) {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    if (username.length < 3) {
      setMensaje("El usuario debe tener al menos 3 caracteres");
      return;
    }

    if (password.length < 4) {
      setMensaje("La contrasena debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contrasenas no coinciden");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje("Email invalido");
      return;
    }

    try {
      setCargando(true);

      const resp = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          email,
          nombre,
          fecha_nacimiento: fechaNacimiento,
          role: registerRole
        }),
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
          setNombre("");
          setFechaNacimiento("");
          setRegisterRole("alumno");
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
    setNombre("");
    setFechaNacimiento("");
    setRegisterRole("alumno");
    setCargando(false);
  };

  const switchModal = (modal) => {
    setMensaje("");
    setActiveModal(modal);
  };

  return (
    <div className="welcome-container">
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

      <div className="welcome-content">
        <header className="welcome-header">
          <div className="logo-container">
            <div className="logo-circle"></div>
            <h1 className="main-title">Sistema de Tutorias ITSJ</h1>
          </div>
          <p className="subtitle">
            
          </p>
        </header>

        <div className="welcome-card">
          <h2 className="welcome-message">
            Bienvenido al Sistema de Tutorias ITSJ
          </h2>
          <p className="welcome-description">
            Accede con tu cuenta o registrate para comenzar a utilizar todas las funcionalidades del sistema educativo.
          </p>

          <div className="button-container">
            <button 
              className="welcome-button login-btn"
              onClick={() => setActiveModal('login')}
            >
              <span className="button-icon-text">Iniciar Sesion</span>
            </button>
            <button 
              className="welcome-button register-btn"
              onClick={() => setActiveModal('register')}
            >
              <span className="button-icon-text">Registrarse</span>
            </button>
          </div>
        </div>

        <footer className="welcome-footer">
          <div className="footer-content">
            <p>Necesitas ayuda?</p>
            <a href="#contact" className="footer-link">
              <span className="link-text">Contactanos</span>
            </a>
          </div>
        </footer>
      </div>

      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-icon-text">Inicio de Sesion</div>
              <button className="close-button" onClick={closeModal} aria-label="Cerrar">
                <span className="close-icon">×</span>
              </button>
              
              <div className="modal-header">
                <h2>Iniciar Sesion</h2>
                <p>Ingresa tus credenciales para acceder</p>
              </div>
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
                  <label htmlFor="login-username" className="form-label">
                    <span className="label-text">Usuario</span>
                  </label>
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
                  <label htmlFor="login-password" className="form-label">
                    <span className="label-text">Contrasena</span>
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`submit-button ${cargando ? 'loading' : ''}`}
              >
                <span className="button-text">
                  {cargando ? "Iniciando..." : "Iniciar Sesion"}
                </span>
                <div className="button-loader">
                  <div className="spinner"></div>
                </div>
                <div className="button-glow"></div>
              </button>
            </form>

            {mensaje && (
              <div className={`message ${mensaje.includes("correctamente") ? 'success' : 'error'}`}>
                <div className="message-icon">
                  {mensaje.includes("correctamente") ? "✓" : "!"}
                </div>
                <div className="message-text">{mensaje}</div>
              </div>
            )}

            <div className="modal-footer">
              <p>
                No tienes cuenta?{" "}
                <button
                  className="link-button"
                  onClick={(e) => {
                    e.preventDefault();
                    switchModal("register");
                  }}
                >
                  Registrate aqui
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'register' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <div className="modal-icon-text">Crear Cuenta</div>
              <button className="close-button" onClick={closeModal} aria-label="Cerrar">
                <span className="close-icon">×</span>
              </button>
              
              <div className="modal-header">
                <h2>Crear Cuenta</h2>
                <p>Registrate para comenzar a usar el sistema</p>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="modal-form">
              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="form-input"
                    placeholder=" "
                  />
                  <label htmlFor="register-nombre" className="form-label">
                    <span className="label-text">Nombre Completo</span>
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    id="register-fecha"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="form-input"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <label htmlFor="register-fecha" className="form-label form-label-date">
                    <span className="label-text">Fecha de Nacimiento</span>
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

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
                  <label htmlFor="register-username" className="form-label">
                    <span className="label-text">Usuario</span>
                  </label>
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
                  <label htmlFor="register-email" className="form-label">
                    <span className="label-text">Email</span>
                  </label>
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
                  <label htmlFor="register-password" className="form-label">
                    <span className="label-text">Contrasena</span>
                  </label>
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
                  <label htmlFor="register-confirm-password" className="form-label">
                    <span className="label-text">Confirmar Contrasena</span>
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              <div className="form-group">
                <label className="section-label">
                  <span className="label-text">Selecciona tu rol</span>
                </label>
                <div className="role-selector">
                  <div className="radio-group">
                    <label className={`radio-option radio-admin ${registerRole === 'administrador' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="register-role"
                        value="administrador"
                        checked={registerRole === 'administrador'}
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="radio-input"
                      />
                      <span className="radio-label">
                        <span className="role-text">
                          <span className="role-title">Administrador</span>
                          <span className="role-desc">Acceso completo</span>
                        </span>
                      </span>
                    </label>

                    <label className={`radio-option radio-tutor ${registerRole === 'tutor' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="register-role"
                        value="tutor"
                        checked={registerRole === 'tutor'}
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="radio-input"
                      />
                      <span className="radio-label">
                        <span className="role-text">
                          <span className="role-title">Tutor</span>
                          <span className="role-desc">Gestion de alumnos</span>
                        </span>
                      </span>
                    </label>

                    <label className={`radio-option radio-alumno ${registerRole === 'alumno' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="register-role"
                        value="alumno"
                        checked={registerRole === 'alumno'}
                        onChange={(e) => setRegisterRole(e.target.value)}
                        className="radio-input"
                      />
                      <span className="radio-label">
                        <span className="role-text">
                          <span className="role-title">Alumno</span>
                          <span className="role-desc">Acceso estudiante</span>
                        </span>
                      </span>
                    </label>
                  </div>
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
                <div className="button-loader">
                  <div className="spinner"></div>
                </div>
                <div className="button-glow"></div>
              </button>
            </form>

            {mensaje && (
              <div className={`message ${mensaje.includes("exitoso") ? 'success' : 'error'}`}>
                <div className="message-icon">
                  {mensaje.includes("exitoso") ? "✓" : "!"}
                </div>
                <div className="message-text">{mensaje}</div>
              </div>
            )}

            <div className="modal-footer">
              <p>
                Ya tienes cuenta?{" "}
                <button
                  className="link-button"
                  onClick={(e) => {
                    e.preventDefault();
                    switchModal("login");
                  }}
                >
                  Inicia sesion aqui
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;