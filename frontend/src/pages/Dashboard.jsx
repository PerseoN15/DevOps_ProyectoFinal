import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [currentSection, setCurrentSection] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowWelcome(false), 3000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos dias";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="dashboard-container">
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content-overlay">
            <h1 className="welcome-title">Bienvenido de nuevo!</h1>
            <p className="welcome-user">{user?.nombre || user?.username}</p>
          </div>
        </div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">ITSJ</div>
            {sidebarOpen && <span className="logo-text">Sistema Tutorias</span>}
          </div>
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
            {currentSection === 'inicio' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'perfil' ? 'active' : ''}`}
            onClick={() => setCurrentSection('perfil')}
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span>Mi Perfil</span>}
            {currentSection === 'perfil' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'cursos' ? 'active' : ''}`}
            onClick={() => setCurrentSection('cursos')}
          >
            <span className="nav-icon">📚</span>
            {sidebarOpen && <span>Mis Cursos</span>}
            {currentSection === 'cursos' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'tareas' ? 'active' : ''}`}
            onClick={() => setCurrentSection('tareas')}
          >
            <span className="nav-icon">✅</span>
            {sidebarOpen && <span>Tareas</span>}
            {currentSection === 'tareas' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'calificaciones' ? 'active' : ''}`}
            onClick={() => setCurrentSection('calificaciones')}
          >
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span>Calificaciones</span>}
            {currentSection === 'calificaciones' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'configuracion' ? 'active' : ''}`}
            onClick={() => setCurrentSection('configuracion')}
          >
            <span className="nav-icon">⚙️</span>
            {sidebarOpen && <span>Configuracion</span>}
            {currentSection === 'configuracion' && <span className="active-indicator"></span>}
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
            <h1>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h1>
            <p className="header-subtitle">
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="header-right">
            <div className="notifications">
              <button className="notification-btn">
                <span className="notification-icon">🔔</span>
                <span className="notification-badge">3</span>
              </button>
            </div>
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.nombre || user?.username}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <div className="user-avatar">
                <div className="avatar-ring-small"></div>
                {user?.nombre?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {currentSection === 'inicio' && (
            <div className="dashboard-section fade-in">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>{getGreeting()}, {user?.nombre || user?.username}</h2>
                  <p className="welcome-subtitle">Estas listo para un dia productivo?</p>
                </div>
                <div className="welcome-icon">
                  <div className="pulse-circle"></div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card card-purple slide-up">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">📚</div>
                    <div className="stat-glow purple"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Mis Cursos</h3>
                    <p className="stat-number">5</p>
                    <span className="stat-change positive">+2 este mes</span>
                  </div>
                </div>

                <div className="stat-card card-blue slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">✅</div>
                    <div className="stat-glow blue"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Tareas Pendientes</h3>
                    <p className="stat-number">3</p>
                    <span className="stat-change">Fecha limite proxima</span>
                  </div>
                </div>

                <div className="stat-card card-green slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">📊</div>
                    <div className="stat-glow green"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Promedio General</h3>
                    <p className="stat-number">8.5</p>
                    <span className="stat-change positive">+0.3 puntos</span>
                  </div>
                </div>

                <div className="stat-card card-orange slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-glow orange"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Asistencias</h3>
                    <p className="stat-number">95%</p>
                    <span className="stat-change positive">Excelente!</span>
                  </div>
                </div>
              </div>

              <div className="content-grid">
                <div className="recent-activity slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="section-header">
                    <h3>Actividad Reciente</h3>
                    <button className="view-all-btn">Ver todo</button>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon purple-bg">📝</div>
                      <div className="activity-details">
                        <p className="activity-title">Nueva tarea asignada</p>
                        <p className="activity-desc">Matematicas - Ejercicios Cap. 5</p>
                        <p className="activity-date">Hace 2 horas</p>
                      </div>
                      <div className="activity-badge new">Nuevo</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon blue-bg">📖</div>
                      <div className="activity-details">
                        <p className="activity-title">Material disponible</p>
                        <p className="activity-desc">Programacion Web - Clase 12</p>
                        <p className="activity-date">Hace 5 horas</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon green-bg">💬</div>
                      <div className="activity-details">
                        <p className="activity-title">Mensaje del tutor</p>
                        <p className="activity-desc">Recordatorio de examen</p>
                        <p className="activity-date">Ayer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-access slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="section-header">
                    <h3>Acceso Rapido</h3>
                  </div>
                  <div className="quick-links">
                    <button className="quick-link-card" onClick={() => setCurrentSection('tareas')}>
                      <div className="quick-link-icon purple-bg">📋</div>
                      <span>Mis Tareas</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('cursos')}>
                      <div className="quick-link-icon blue-bg">📚</div>
                      <span>Ver Cursos</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('calificaciones')}>
                      <div className="quick-link-icon green-bg">📊</div>
                      <span>Calificaciones</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('perfil')}>
                      <div className="quick-link-icon orange-bg">👤</div>
                      <span>Mi Perfil</span>
                    </button>
                  </div>

                  <div className="upcoming-events">
                    <h4>Proximos Eventos</h4>
                    <div className="event-item">
                      <div className="event-date">
                        <span className="day">15</span>
                        <span className="month">Dic</span>
                      </div>
                      <div className="event-info">
                        <p className="event-title">Entrega Proyecto Final</p>
                        <p className="event-course">Matematicas</p>
                      </div>
                    </div>
                    <div className="event-item">
                      <div className="event-date">
                        <span className="day">20</span>
                        <span className="month">Dic</span>
                      </div>
                      <div className="event-info">
                        <p className="event-title">Examen Parcial</p>
                        <p className="event-course">Programacion Web</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSection === 'perfil' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mi Perfil</h2>
              <div className="profile-container">
                <div className="profile-card slide-up">
                  <div className="profile-header-section">
                    <div className="profile-avatar-large">
                      <div className="avatar-ring"></div>
                      <div className="avatar-content">
                        {user?.nombre?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="profile-info-header">
                      <h3>{user?.nombre || "Usuario"}</h3>
                      <p className="profile-role">{user?.role || "Alumno"}</p>
                      <div className="profile-stats-mini">
                        <div className="mini-stat">
                          <span className="mini-number">5</span>
                          <span className="mini-label">Cursos</span>
                        </div>
                        <div className="mini-stat">
                          <span className="mini-number">8.5</span>
                          <span className="mini-label">Promedio</span>
                        </div>
                        <div className="mini-stat">
                          <span className="mini-number">95%</span>
                          <span className="mini-label">Asistencia</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-details">
                    <div className="detail-group">
                      <h4>Informacion Personal</h4>
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
                            ? new Date(user.fecha_nacimiento).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "No especificada"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Rol:</span>
                        <span className="detail-value capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </div>

                  <button className="edit-profile-btn">
                    <span>Editar Perfil</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentSection === 'cursos' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mis Cursos</h2>
              <p>Seccion en desarrollo</p>
            </div>
          )}

          {currentSection === 'tareas' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mis Tareas</h2>
              <p>Seccion en desarrollo</p>
            </div>
          )}

          {currentSection === 'calificaciones' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mis Calificaciones</h2>
              <p>Seccion en desarrollo</p>
            </div>
          )}

          {currentSection === 'configuracion' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Configuracion</h2>
              <p>Seccion en desarrollo</p>
            </div>
          )}
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