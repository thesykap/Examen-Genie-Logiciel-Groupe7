const app = require('./src/app');
const pool = require('./src/config/database');
const createTables = require('./src/config/schema');
const seedDatabase = require('./src/config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();

    // Create tables
    await createTables();
    console.log('✓ Database tables created');

    // Seed database
    await seedDatabase();
    console.log('✓ Database seeded');

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();