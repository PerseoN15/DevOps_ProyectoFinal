import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

function DashboardTutor({ user, onLogout }) {
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
            <h1 className="welcome-title">Bienvenido Tutor</h1>
            <p className="welcome-user">{user?.nombre || user?.username}</p>
          </div>
        </div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">ITSJ</div>
            {sidebarOpen && <span className="logo-text">Panel Tutor</span>}
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
            className={`nav-item ${currentSection === 'alumnos' ? 'active' : ''}`}
            onClick={() => setCurrentSection('alumnos')}
          >
            <span className="nav-icon">👨‍🎓</span>
            {sidebarOpen && <span>Mis Alumnos</span>}
            {currentSection === 'alumnos' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'actividades' ? 'active' : ''}`}
            onClick={() => setCurrentSection('actividades')}
          >
            <span className="nav-icon">📝</span>
            {sidebarOpen && <span>Actividades</span>}
            {currentSection === 'actividades' && <span className="active-indicator"></span>}
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
            className={`nav-item ${currentSection === 'tutorias' ? 'active' : ''}`}
            onClick={() => setCurrentSection('tutorias')}
          >
            <span className="nav-icon">📅</span>
            {sidebarOpen && <span>Tutorias</span>}
            {currentSection === 'tutorias' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'reportes' ? 'active' : ''}`}
            onClick={() => setCurrentSection('reportes')}
          >
            <span className="nav-icon">📄</span>
            {sidebarOpen && <span>Reportes</span>}
            {currentSection === 'reportes' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'perfil' ? 'active' : ''}`}
            onClick={() => setCurrentSection('perfil')}
          >
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span>Mi Perfil</span>}
            {currentSection === 'perfil' && <span className="active-indicator"></span>}
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
                <span className="user-role">Tutor</span>
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
                  <p className="welcome-subtitle">Panel de Tutoria</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card card-purple slide-up">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-glow purple"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Alumnos Tutorados</h3>
                    <p className="stat-number">15</p>
                    <span className="stat-change positive">3 nuevos</span>
                  </div>
                </div>

                <div className="stat-card card-blue slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">📝</div>
                    <div className="stat-glow blue"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Actividades</h3>
                    <p className="stat-number">8</p>
                    <span className="stat-change">2 por revisar</span>
                  </div>
                </div>

                <div className="stat-card card-green slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">📅</div>
                    <div className="stat-glow green"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Tutorias Proximas</h3>
                    <p className="stat-number">5</p>
                    <span className="stat-change positive">Esta semana</span>
                  </div>
                </div>

                <div className="stat-card card-orange slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-glow orange"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Promedio Grupo</h3>
                    <p className="stat-number">8.7</p>
                    <span className="stat-change positive">+0.5 pts</span>
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
                        <p className="activity-title">Tarea entregada</p>
                        <p className="activity-desc">Juan Perez - Matematicas</p>
                        <p className="activity-date">Hace 1 hora</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon blue-bg">💬</div>
                      <div className="activity-details">
                        <p className="activity-title">Nuevo mensaje</p>
                        <p className="activity-desc">Maria Lopez solicita tutoria</p>
                        <p className="activity-date">Hace 3 horas</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon green-bg">✅</div>
                      <div className="activity-details">
                        <p className="activity-title">Calificacion asignada</p>
                        <p className="activity-desc">Actividad 5 - Grupo A</p>
                        <p className="activity-date">Ayer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-access slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="section-header">
                    <h3>Acciones Rapidas</h3>
                  </div>
                  <div className="quick-links">
                    <button className="quick-link-card" onClick={() => setCurrentSection('actividades')}>
                      <div className="quick-link-icon purple-bg">➕</div>
                      <span>Nueva Actividad</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('calificaciones')}>
                      <div className="quick-link-icon blue-bg">📊</div>
                      <span>Calificar</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('tutorias')}>
                      <div className="quick-link-icon green-bg">📅</div>
                      <span>Agendar Tutoria</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('alumnos')}>
                      <div className="quick-link-icon orange-bg">👨‍🎓</div>
                      <span>Ver Alumnos</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSection === 'alumnos' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mis Alumnos Tutorados</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Ver Todos</button>
                <button className="action-btn secondary">Exportar Lista</button>
              </div>
              <p className="section-desc">Gestiona tus alumnos tutorados</p>
            </div>
          )}

          {currentSection === 'actividades' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Actividades</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Subir Actividad</button>
                <button className="action-btn secondary">Ver Entregas</button>
              </div>
              <p className="section-desc">Crea y gestiona actividades para tus alumnos</p>
            </div>
          )}

          {currentSection === 'calificaciones' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Asignar Calificaciones</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Nueva Calificacion</button>
                <button className="action-btn secondary">Ver Historial</button>
              </div>
              <p className="section-desc">Asigna y gestiona calificaciones</p>
            </div>
          )}

          {currentSection === 'tutorias' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mis Tutorias</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Agendar Tutoria</button>
                <button className="action-btn secondary">Ver Calendario</button>
              </div>
              <p className="section-desc">Programa y gestiona sesiones de tutoria</p>
            </div>
          )}

          {currentSection === 'reportes' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Reportes de Alumnos</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Generar Reporte</button>
                <button className="action-btn secondary">Exportar PDF</button>
              </div>
              <p className="section-desc">Genera reportes de seguimiento</p>
            </div>
          )}

          {currentSection === 'perfil' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Mi Perfil</h2>
              <p className="section-desc">Informacion personal y preferencias</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

DashboardTutor.propTypes = {
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

export default DashboardTutor;