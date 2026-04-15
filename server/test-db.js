const pool = require('./src/config/database');
console.log('Testing DB connection...');
pool.query('SHOW TABLES').then(([tables]) => {
  console.log('Tables:', Object.keys(tables[0] || {}));
  pool.query('SELECT * FROM users WHERE email = ?', ['admin@football.com']).then(([users]) => {
    console.log('Admin user:', users[0] ? users[0] : 'MISSING');
    process.exit(0);
  });
}).catch(err => {
  console.error('DB Error:', err.message);
  process.exit(1);
});