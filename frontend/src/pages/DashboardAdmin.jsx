import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

function DashboardAdmin({ user, onLogout }) {
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
            <h1 className="welcome-title">Bienvenido Administrador</h1>
            <p className="welcome-user">{user?.nombre || user?.username}</p>
          </div>
        </div>
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">ITSJ</div>
            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
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
            className={`nav-item ${currentSection === 'usuarios' ? 'active' : ''}`}
            onClick={() => setCurrentSection('usuarios')}
          >
            <span className="nav-icon">👥</span>
            {sidebarOpen && <span>Usuarios</span>}
            {currentSection === 'usuarios' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'tutores' ? 'active' : ''}`}
            onClick={() => setCurrentSection('tutores')}
          >
            <span className="nav-icon">👨‍🏫</span>
            {sidebarOpen && <span>Tutores</span>}
            {currentSection === 'tutores' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'alumnos' ? 'active' : ''}`}
            onClick={() => setCurrentSection('alumnos')}
          >
            <span className="nav-icon">👨‍🎓</span>
            {sidebarOpen && <span>Alumnos</span>}
            {currentSection === 'alumnos' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'asignaciones' ? 'active' : ''}`}
            onClick={() => setCurrentSection('asignaciones')}
          >
            <span className="nav-icon">🔗</span>
            {sidebarOpen && <span>Asignaciones</span>}
            {currentSection === 'asignaciones' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'canalizaciones' ? 'active' : ''}`}
            onClick={() => setCurrentSection('canalizaciones')}
          >
            <span className="nav-icon">📋</span>
            {sidebarOpen && <span>Canalizaciones</span>}
            {currentSection === 'canalizaciones' && <span className="active-indicator"></span>}
          </button>

          <button 
            className={`nav-item ${currentSection === 'reportes' ? 'active' : ''}`}
            onClick={() => setCurrentSection('reportes')}
          >
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span>Reportes</span>}
            {currentSection === 'reportes' && <span className="active-indicator"></span>}
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
                <span className="notification-badge">5</span>
              </button>
            </div>
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.nombre || user?.username}</span>
                <span className="user-role">Administrador</span>
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
                  <p className="welcome-subtitle">Panel de Administracion del Sistema</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card card-purple slide-up">
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">👥</div>
                    <div className="stat-glow purple"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Total Usuarios</h3>
                    <p className="stat-number">156</p>
                    <span className="stat-change positive">+12 este mes</span>
                  </div>
                </div>

                <div className="stat-card card-blue slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-glow blue"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Tutores Activos</h3>
                    <p className="stat-number">25</p>
                    <span className="stat-change">8 disponibles</span>
                  </div>
                </div>

                <div className="stat-card card-green slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-glow green"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Alumnos</h3>
                    <p className="stat-number">128</p>
                    <span className="stat-change positive">Todos tutorados</span>
                  </div>
                </div>

                <div className="stat-card card-orange slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="stat-icon-wrapper">
                    <div className="stat-icon">📋</div>
                    <div className="stat-glow orange"></div>
                  </div>
                  <div className="stat-info">
                    <h3>Canalizaciones</h3>
                    <p className="stat-number">18</p>
                    <span className="stat-change">7 pendientes</span>
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
                      <div className="activity-icon purple-bg">👥</div>
                      <div className="activity-details">
                        <p className="activity-title">Nuevo usuario registrado</p>
                        <p className="activity-desc">Juan Perez - Alumno</p>
                        <p className="activity-date">Hace 1 hora</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon blue-bg">🔗</div>
                      <div className="activity-details">
                        <p className="activity-title">Asignacion de tutor</p>
                        <p className="activity-desc">Maria Lopez asignada a 5 alumnos</p>
                        <p className="activity-date">Hace 3 horas</p>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon orange-bg">📋</div>
                      <div className="activity-details">
                        <p className="activity-title">Nueva canalizacion</p>
                        <p className="activity-desc">Alumno requiere apoyo psicologico</p>
                        <p className="activity-date">Hace 5 horas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-access slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="section-header">
                    <h3>Acciones Rapidas</h3>
                  </div>
                  <div className="quick-links">
                    <button className="quick-link-card" onClick={() => setCurrentSection('usuarios')}>
                      <div className="quick-link-icon purple-bg">➕</div>
                      <span>Nuevo Usuario</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('asignaciones')}>
                      <div className="quick-link-icon blue-bg">🔗</div>
                      <span>Asignar Tutor</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('canalizaciones')}>
                      <div className="quick-link-icon orange-bg">📋</div>
                      <span>Canalizacion</span>
                    </button>
                    <button className="quick-link-card" onClick={() => setCurrentSection('reportes')}>
                      <div className="quick-link-icon green-bg">📊</div>
                      <span>Ver Reportes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentSection === 'usuarios' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Gestion de Usuarios</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Agregar Usuario</button>
                <button className="action-btn secondary">Importar CSV</button>
                <button className="action-btn secondary">Exportar</button>
              </div>
              <p className="section-desc">Administra todos los usuarios del sistema</p>
            </div>
          )}

          {currentSection === 'tutores' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Gestion de Tutores</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Dar de Alta Tutor</button>
                <button className="action-btn secondary">Ver Disponibilidad</button>
              </div>
              <p className="section-desc">Administra los tutores del sistema</p>
            </div>
          )}

          {currentSection === 'alumnos' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Gestion de Alumnos</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Dar de Alta Alumno</button>
                <button className="action-btn secondary">Importar Lista</button>
              </div>
              <p className="section-desc">Administra los alumnos del sistema</p>
            </div>
          )}

          {currentSection === 'asignaciones' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Asignacion de Tutores</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Nueva Asignacion</button>
                <button className="action-btn secondary">Reasignar</button>
              </div>
              <p className="section-desc">Asigna tutores a los alumnos</p>
            </div>
          )}

          {currentSection === 'canalizaciones' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Canalizaciones</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Nueva Canalizacion</button>
                <button className="action-btn secondary">Ver Pendientes</button>
              </div>
              <p className="section-desc">Gestiona las canalizaciones de alumnos</p>
            </div>
          )}

          {currentSection === 'reportes' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Reportes y Estadisticas</h2>
              <div className="admin-actions">
                <button className="action-btn primary">Generar Reporte</button>
                <button className="action-btn secondary">Exportar PDF</button>
              </div>
              <p className="section-desc">Visualiza y genera reportes del sistema</p>
            </div>
          )}

          {currentSection === 'configuracion' && (
            <div className="dashboard-section fade-in">
              <h2 className="section-title">Configuracion del Sistema</h2>
              <p className="section-desc">Ajustes generales del sistema</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

DashboardAdmin.propTypes = {
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

export default DashboardAdmin;
