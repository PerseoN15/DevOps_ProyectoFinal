import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardTutor from "./pages/DashboardTutor";
import DashboardAlumno from "./pages/DashboardAlumno";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const renderDashboard = () => {
    if (!user) return <Login onLoginSuccess={handleLoginSuccess} />;

    switch (user.role) {
      case 'administrador':
        return <DashboardAdmin user={user} onLogout={handleLogout} />;
      case 'tutor':
        return <DashboardTutor user={user} onLogout={handleLogout} />;
      case 'alumno':
        return <DashboardAlumno user={user} onLogout={handleLogout} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
}

export default App;