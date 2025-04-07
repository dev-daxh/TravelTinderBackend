const mysql = require('mysql2');

// MySQL Connection Pool Setup
const pool = mysql.createPool({
  connectionLimit: 10, // Maximum connections in the pool
  host: '172.206.192.231',
  user: 'daksht',
  password: 'qwerpoiudt001',
  database: 'TravelTinder_db',
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 100000, // 100 seconds timeout for connection
  acquireTimeout: 100000, // 100 seconds timeout for acquiring a connection
  timeout: 10000 // General timeout for queries
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.code || err.message);
    return;
  }

  console.log('Successfully connected to the MySQL server.',connection.threadId);

  // Always release the connection back to the pool after use
  connection.release();
});

// Optional: Handle pool connection errors
pool.on('connection', (connection) => {
  console.log('New connection established.');
});

pool.on('error', (err) => {
  console.error('MySQL pool error:', err.message);
});

module.exports = pool;  // Use module.exports
