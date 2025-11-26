// backend/db/db.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

// Obtener ruta absoluta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la base de datos tutorias.db dentro de /db
const dbPath = path.join(__dirname, "tutorias.db");

// Crear o abrir la BD
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`
  );

  // Usuario inicial solo si no existe
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error("Error al contar usuarios:", err);
      return;
    }

    if (row.count === 0) {
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        ["admin", "123456"],
        (err2) => {
          if (err2) {
            console.error("Error al insertar usuario inicial:", err2);
          } else {
            console.log("Usuario inicial creado: admin / 123456");
          }
        }
      );
    }
  });
});

export default db;
