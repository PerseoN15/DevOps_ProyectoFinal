import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardTutor from "./pages/DashboardTutor.jsx";
import DashboardAlumno from "./pages/DashboardAlumno.jsx";
//import GoogleTest from "./GoogleTest";

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
