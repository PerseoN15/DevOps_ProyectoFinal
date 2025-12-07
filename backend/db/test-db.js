const { pool, testConnection } = require('./dbMySql.js');

async function testDatabase() {
  console.log('Probando conexion a la base de datos...');
  
  try {
    await testConnection();
    
    console.log('\nProbando consulta a tabla users...');
    const [rows] = await pool.query('SELECT * FROM users LIMIT 1');
    console.log('Resultado:', rows);
    
    console.log('\nProbando estructura de tabla...');
    const [columns] = await pool.query('DESCRIBE users');
    console.log('Columnas de la tabla users:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
  } catch (error) {
    console.error('Error en prueba:', error.message);
  } finally {
    process.exit();
  }
}

testDatabase();