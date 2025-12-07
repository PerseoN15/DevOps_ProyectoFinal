const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = null;

  // Buscar token en header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Buscar token en cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado' });
    }
    return res.status(403).json({ message: 'Token inválido' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const userRole = req.user.role.toLowerCase();
    const hasRole = rolesArray.some(role => role.toLowerCase() === userRole);

    if (!hasRole) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }

    next();
  };
};

const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Debes estar autenticado para acceder' });
  }
  next();
};

module.exports = {
  verifyToken,
  checkRole,
  isAuthenticated
};