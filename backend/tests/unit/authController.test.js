const bcrypt = require('bcrypt');
const { pool } = require('../../db/dbMySql.js');
const { loginUser, registerUser } = require('../../controllers/authController');

jest.mock('bcrypt');
jest.mock('../../db/dbMySql.js', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('AuthController - Pruebas Unitarias', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    
    test('debe registrar un nuevo usuario exitosamente', async () => {
      const req = createMockRequest({
        body: {
          username: 'nuevouser',
          email: 'nuevo@itsj.edu.mx',
          password: 'Password123',
          nombre: 'Nuevo Usuario',
          fecha_nacimiento: '2000-01-01',
          role: 'alumno'
        }
      });
      const res = createMockResponse();
      
      pool.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);
      
      bcrypt.hash.mockResolvedValue('hashed_password');
      
      await registerUser(req, res);
      
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          message: expect.any(String),
          username: 'nuevouser'
        })
      );
    });

    test('debe rechazar registro con usuario duplicado', async () => {
      const req = createMockRequest({
        body: {
          username: 'existente',
          email: 'existente@itsj.edu.mx',
          password: 'Password123',
          nombre: 'Usuario Existente',
          fecha_nacimiento: '2000-01-01',
          role: 'alumno'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockResolvedValue([[{ id: 1 }]]);
      
      await registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('ya esta registrado')
        })
      );
    });

    test('debe validar campos requeridos', async () => {
      const req = createMockRequest({
        body: {
          username: 'test'
        }
      });
      const res = createMockResponse();
      
      await registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('obligatorios')
        })
      );
    });

    test('debe validar longitud mínima de usuario', async () => {
      const req = createMockRequest({
        body: {
          username: 'ab',
          email: 'test@itsj.edu.mx',
          password: 'Password123',
          nombre: 'Test',
          fecha_nacimiento: '2000-01-01'
        }
      });
      const res = createMockResponse();
      
      await registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('al menos 3 caracteres')
        })
      );
    });

    test('debe validar formato de email', async () => {
      const req = createMockRequest({
        body: {
          username: 'testuser',
          email: 'email-invalido',
          password: 'Password123',
          nombre: 'Test',
          fecha_nacimiento: '2000-01-01'
        }
      });
      const res = createMockResponse();
      
      await registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('invalido')
        })
      );
    });

    test('debe manejar errores de base de datos', async () => {
      const req = createMockRequest({
        body: {
          username: 'testuser',
          email: 'test@itsj.edu.mx',
          password: 'Password123',
          nombre: 'Test User',
          fecha_nacimiento: '2000-01-01'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockRejectedValue(new Error('DB Error'));
      
      await registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('Error interno')
        })
      );
    });
  });

  describe('loginUser', () => {
    
    test('debe autenticar usuario con credenciales correctas', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@itsj.edu.mx',
        password: 'hashed_password',
        nombre: 'Test User',
        fecha_nacimiento: '2000-01-01',
        role: 'alumno'
      };
      
      const req = createMockRequest({
        body: {
          username: 'testuser',
          password: 'Password123'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(true);
      
      await loginUser(req, res);
      
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashed_password');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          message: expect.stringContaining('correctamente'),
          user: expect.objectContaining({
            id: 1,
            username: 'testuser',
            role: 'alumno'
          })
        })
      );
    });

    test('debe rechazar login con contraseña incorrecta', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashed_password'
      };
      
      const req = createMockRequest({
        body: {
          username: 'testuser',
          password: 'WrongPassword'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(false);
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('incorrectos')
        })
      );
    });

    test('debe rechazar login con usuario inexistente', async () => {
      const req = createMockRequest({
        body: {
          username: 'noexiste',
          password: 'Password123'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockResolvedValue([[]]);
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('incorrectos')
        })
      );
    });

    test('debe validar campos requeridos en login', async () => {
      const req = createMockRequest({
        body: {
          username: 'test'
        }
      });
      const res = createMockResponse();
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          message: expect.stringContaining('obligatorios')
        })
      );
    });

    test('no debe exponer la contraseña en la respuesta', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@itsj.edu.mx',
        password: 'hashed_password',
        nombre: 'Test User',
        fecha_nacimiento: '2000-01-01',
        role: 'alumno'
      };
      
      const req = createMockRequest({
        body: {
          username: 'testuser',
          password: 'Password123'
        }
      });
      const res = createMockResponse();
      
      pool.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(true);
      
      await loginUser(req, res);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.user).not.toHaveProperty('password');
    });
  });
});