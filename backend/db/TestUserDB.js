// backend/db/TestUserDB.js
import sqlite3 from "sqlite3";
import path from "path";

// Ruta FIJA a tu carpeta del servidor
const DB_PATH = path.join("/home/ec2-user/db", "login_test.sqlite");

class TestUserDB {
  constructor() {
    console.log("[TestUserDB] Usando base en:", DB_PATH);
    this.db = new sqlite3.Database(DB_PATH);
    this.init();
  }

  init() {
    this.db.serialize(() => {
      console.log("[TestUserDB] Inicializando base de datos de prueba...");

      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )
      `);

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
        "SELECT * FROM users WHERE username = ?",
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
