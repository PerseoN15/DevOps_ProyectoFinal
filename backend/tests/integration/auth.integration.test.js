const request = require('supertest');
const mysql = require('mysql2/promise');

describe('Auth API - Pruebas de Integración', () => {
  
  let connection;
  let testUserId;
  let authToken;
  let app;

  beforeAll(async () => {
    // Crear conexión de prueba
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tutorias_db'
    });

    // Importar app después de establecer conexión
    app = require('../../index');

    // Crear usuario de prueba
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    const [result] = await connection.query(
      'INSERT INTO usuarios (username, email, password, nombre, role) VALUES (?, ?, ?, ?, ?)',
      ['testintegration', 'integration@test.com', hashedPassword, 'Test Integration', 'alumno']
    );
    testUserId = result.insertId;
  });

  afterAll(async () => {
    if (testUserId) {
      await connection.query('DELETE FROM usuarios WHERE id = ?', [testUserId]);
    }
    if (connection) {
      await connection.end();
    }
  });

  describe('POST /api/auth/register', () => {
    
    test('debe registrar un nuevo usuario exitosamente', async () => {
      const newUser = {
        username: 'newintegrationuser',
        email: 'newuser@itsj.edu.mx',
        password: 'SecurePass123!',
        nombre: 'New Integration User',
        role: 'alumno'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBeGreaterThan(0);

      await connection.query('DELETE FROM usuarios WHERE username = ?', [newUser.username]);
    });

    test('debe rechazar registro con email duplicado', async () => {
      const duplicateUser = {
        username: 'anotheruser',
        email: 'integration@test.com',
        password: 'SecurePass123!',
        nombre: 'Another User',
        role: 'alumno'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/ya existe/i);
    });
  });

  describe('POST /api/auth/login', () => {
    
    test('debe autenticar usuario con credenciales correctas', async () => {
      const credentials = {
        username: 'testintegration',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', 'testintegration');
      expect(response.body.user).not.toHaveProperty('password');

      authToken = response.body.token;
    });

    test('debe rechazar login con contraseña incorrecta', async () => {
      const wrongCredentials = {
        username: 'testintegration',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(wrongCredentials)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/credenciales/i);
    });
  });

  describe('GET /api/auth/profile', () => {
    
    test('debe retornar perfil de usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'testintegration');
      expect(response.body).not.toHaveProperty('password');
    });

    test('debe rechazar acceso sin token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Flujo completo de autenticación', () => {
    
    test('debe completar flujo: registro → login → perfil → logout', async () => {
      const newUser = {
        username: 'flowtest',
        email: 'flowtest@itsj.edu.mx',
        password: 'FlowTest123!',
        nombre: 'Flow Test User',
        role: 'alumno'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('userId');

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: newUser.username,
          password: newUser.password
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
      const token = loginResponse.body.token;

      const profileResponse = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.username).toBe(newUser.username);

      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await connection.query('DELETE FROM usuarios WHERE username = ?', [newUser.username]);
    });
  });
});