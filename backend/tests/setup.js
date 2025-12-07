// tests/setup.js - Configuración global para pruebas

jest.setTimeout(10000);

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-12345';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'test_tutorias_db';
process.env.DB_PORT = '3306';

afterEach(() => {
  jest.clearAllMocks();
});

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

global.createMockUser = (overrides = {}) => {
  return {
    id: 1,
    username: 'testuser',
    email: 'test@itsj.edu.mx',
    nombre: 'Usuario Test',
    role: 'alumno',
    created_at: new Date(),
    ...overrides
  };
};

global.createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  };
};

global.createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };
  return res;
};

global.createMockNext = () => jest.fn();

console.log('Test setup completado');