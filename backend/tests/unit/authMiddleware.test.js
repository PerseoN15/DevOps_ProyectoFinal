const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

jest.mock('jsonwebtoken');

describe('AuthMiddleware - Pruebas Unitarias', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    
    test('debe autenticar con token válido en header', () => {
      const mockDecoded = { id: 1, username: 'testuser', role: 'alumno' };
      const req = createMockRequest({
        headers: {
          authorization: 'Bearer valid_token_123'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.verify.mockReturnValue(mockDecoded);
      
      authMiddleware.verifyToken(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('valid_token_123', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe autenticar con token válido en cookie', () => {
      const mockDecoded = { id: 1, username: 'testuser' };
      const req = createMockRequest({
        cookies: {
          token: 'cookie_token_123'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.verify.mockReturnValue(mockDecoded);
      
      authMiddleware.verifyToken(req, res, next);
      
      expect(jwt.verify).toHaveBeenCalledWith('cookie_token_123', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
    });

    test('debe rechazar request sin token', () => {
      const req = createMockRequest({
        headers: {},
        cookies: {}
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      authMiddleware.verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Token no proporcionado')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('debe rechazar token inválido', () => {
      const req = createMockRequest({
        headers: {
          authorization: 'Bearer invalid_token'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      authMiddleware.verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Token inválido')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('debe rechazar token expirado', () => {
      const req = createMockRequest({
        headers: {
          authorization: 'Bearer expired_token'
        }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      
      authMiddleware.verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('expirado')
        })
      );
    });
  });

  describe('checkRole', () => {
    
    test('debe permitir acceso a usuario con rol correcto', () => {
      const req = createMockRequest({
        user: { id: 1, role: 'administrador' }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      const middleware = authMiddleware.checkRole(['administrador', 'tutor']);
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe rechazar acceso a usuario sin rol requerido', () => {
      const req = createMockRequest({
        user: { id: 1, role: 'alumno' }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      const middleware = authMiddleware.checkRole(['administrador', 'tutor']);
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('No tienes permisos')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('debe rechazar si no hay usuario en request', () => {
      const req = createMockRequest({
        user: null
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      const middleware = authMiddleware.checkRole(['administrador']);
      
      middleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('isAuthenticated', () => {
    
    test('debe permitir acceso a usuario autenticado', () => {
      const req = createMockRequest({
        user: { id: 1, username: 'testuser' }
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      authMiddleware.isAuthenticated(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe rechazar acceso a usuario no autenticado', () => {
      const req = createMockRequest({
        user: null
      });
      const res = createMockResponse();
      const next = createMockNext();
      
      authMiddleware.isAuthenticated(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('autenticado')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});