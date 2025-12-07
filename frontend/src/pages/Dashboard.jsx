import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [currentSection, setCurrentSection] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log("Usuario logueado:", user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case "inicio":
        return (
          <div className="dashboard-section">
            <h2>Bienvenido, {user?.nombre || user?.username}</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>Mis Cursos</h3>
                  <p className="stat-number">5</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Tareas Pendientes</h3>
                  <p className="stat-number">3</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Promedio</h3>
                  <p className="stat-number">8.5</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>Asistencias</h3>
                  <p className="stat-number">95%</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Actividad Reciente</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <p className="activity-title">Nueva tarea asignada</p>
                    <p className="activity-date">Hace 2 horas</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📖</div>
                  <div className="activity-details">
                    <p className="activity-title">Material de lectura disponible</p>
                    <p className="activity-date">Hace 5 horas</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💬</div>
                  <div className="activity-details">
                    <p className="activity-title">Nuevo mensaje del tutor</p>
                    <p className="activity-date">Ayer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "perfil":
        return (
          <div className="dashboard-section">
            <h2>Mi Perfil</h2>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.nombre?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h3>{user?.nombre || "Usuario"}</h3>
                  <p className="profile-role">{user?.role || "Alumno"}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Usuario:</span>
                  <span className="detail-value">{user?.username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha de Nacimiento:</span>
                  <span className="detail-value">
                    {user?.fecha_nacimiento 
                      ? new Date(user.fecha_nacimiento).toLocaleDateString('es-MX')
                      : "No especificada"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Rol:</span>
                  <span className="detail-value capitalize">{user?.role}</span>
                </div>
              </div>

              <button className="edit-profile-btn">Editar Perfil</button>
            </div>
          </div>
        );

      case "cursos":
        return (
          <div className="dashboard-section">
            <h2>Mis Cursos</h2>
            <div className="courses-grid">
              <div className="course-card">
                <div className="course-header">
                  <h3>Matematicas Avanzadas</h3>
                  <span className="course-status active">Activo</span>
                </div>
                <p className="course-description">Calculo diferencial e integral</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <span className="progress-text">75% completado</span>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h3>Programacion Web</h3>
                  <span className="course-status active">Activo</span>
                </div>
                <p className="course-description">Desarrollo frontend y backend</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-text">60% completado</span>
                </div>
              </div>

              <div className="course-card">
                <div className="course-header">
                  <h3>Base de Datos</h3>
                  <span className="course-status active">Activo</span>
                </div>
                <p className="course-description">SQL y NoSQL avanzado</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                  <span className="progress-text">85% completado</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "tareas":
        return (
          <div className="dashboard-section">
            <h2>Mis Tareas</h2>
            <div className="tasks-container">
              <div className="task-card pending">
                <div className="task-header">
                  <h3>Proyecto Final - Matematicas</h3>
                  <span className="task-badge pending">Pendiente</span>
                </div>
                <p className="task-description">Resolver los ejercicios del capitulo 5</p>
                <div className="task-footer">
                  <span className="task-date">Fecha limite: 15 Dic 2025</span>
                  <button className="task-btn">Ver Detalles</button>
                </div>
              </div>

              <div className="task-card pending">
                <div className="task-header">
                  <h3>Practica de Programacion</h3>
                  <span className="task-badge pending">Pendiente</span>
                </div>
                <p className="task-description">Crear aplicacion CRUD con React</p>
                <div className="task-footer">
                  <span className="task-date">Fecha limite: 20 Dic 2025</span>
                  <button className="task-btn">Ver Detalles</button>
                </div>
              </div>

              <div className="task-card completed">
                <div className="task-header">
                  <h3>Investigacion Base de Datos</h3>
                  <span className="task-badge completed">Completada</span>
                </div>
                <p className="task-description">Comparativa entre MySQL y PostgreSQL</p>
                <div className="task-footer">
                  <span className="task-date">Entregado: 5 Dic 2025</span>
                  <button className="task-btn">Ver Calificacion</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "calificaciones":
        return (
          <div className="dashboard-section">
            <h2>Mis Calificaciones</h2>
            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>Parcial 1</th>
                    <th>Parcial 2</th>
                    <th>Parcial 3</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Matematicas Avanzadas</td>
                    <td>8.5</td>
                    <td>9.0</td>
                    <td>8.7</td>
                    <td className="grade-excellent">8.7</td>
                  </tr>
                  <tr>
                    <td>Programacion Web</td>
                    <td>9.5</td>
                    <td>9.0</td>
                    <td>9.2</td>
                    <td className="grade-excellent">9.2</td>
                  </tr>
                  <tr>
                    <td>Base de Datos</td>
                    <td>7.5</td>
                    <td>8.0</td>
                    <td>8.5</td>
                    <td className="grade-good">8.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case "configuracion":
        return (
          <div className="dashboard-section">
            <h2>Configuracion</h2>
            <div className="settings-container">
              <div className="settings-section">
                <h3>Preferencias de Cuenta</h3>
                <div className="settings-option">
                  <label>Notificaciones por Email</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="settings-option">
                  <label>Notificaciones Push</label>
                  <input type="checkbox" />
                </div>
                <div className="settings-option">
                  <label>Modo Oscuro</label>
                  <input type="checkbox" />
                </div>
              </div>

              <div className="settings-section">
                <h3>Seguridad</h3>
                <button className="settings-btn">Cambiar Contrasena</button>
                <button className="settings-btn">Autenticacion de Dos Factores</button>
              </div>

              <div className="settings-section danger-zone">
                <h3>Zona de Peligro</h3>
                <button className="settings-btn danger">Eliminar Cuenta</button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="dashboard-section"><h2>Seccion en desarrollo</h2></div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>ITSJ</h2>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentSection === 'inicio' ? 'active' : ''}`}
            onClick={() => setCurrentSection('inicio')}
          >
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span>Inicio</span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'perfil' ? 'active' : ''}`}
            onClick={() => setCurrentSection('perfil')}
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span>Mi Perfil</span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'cursos' ? 'active' : ''}`}
            onClick={() => setCurrentSection('cursos')}
          >
            <span className="nav-icon">📚</span>
            {sidebarOpen && <span>Mis Cursos</span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'tareas' ? 'active' : ''}`}
            onClick={() => setCurrentSection('tareas')}
          >
            <span className="nav-icon">✅</span>
            {sidebarOpen && <span>Tareas</span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'calificaciones' ? 'active' : ''}`}
            onClick={() => setCurrentSection('calificaciones')}
          >
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span>Calificaciones</span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'configuracion' ? 'active' : ''}`}
            onClick={() => setCurrentSection('configuracion')}
          >
            <span className="nav-icon">⚙️</span>
            {sidebarOpen && <span>Configuracion</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span>Cerrar Sesion</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Sistema de Tutorias</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.nombre || user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <div className="user-avatar">
              {user?.nombre?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.string,
    nombre: PropTypes.string,
    fecha_nacimiento: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Dashboard;