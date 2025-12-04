// backend/db/TestUserDB.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Esto es por si algún día cambia el HOME, pero en tu caso es /home/ec2-user
const HOME_DIR = process.env.HOME || '/home/ec2-user';

// /home/ec2-user/db/login_test.sqlite
const DB_PATH = path.join(HOME_DIR, 'db', 'login_test.sqlite');

class TestUserDB {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Crear tabla si no existe
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )
      `);

      // Usuario de prueba (puedes cambiar username y password)
      this.db.run(
        `
        INSERT OR IGNORE INTO users (username, password)
        VALUES ('usuario_prueba', '123456')
        `
      );
    });
  }

  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}

export const testUserDB = new TestUserDB();
