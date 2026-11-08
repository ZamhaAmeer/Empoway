const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbDialect = process.env.DB_DIALECT || 'postgres';

let sequelize;

if (dbDialect === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'empoway_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres123',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'empoway.sqlite'),
    logging: false
  });
}

// Function to test and initialize DB
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Connected successfully via ${sequelize.getDialect()} dialect.`);
    return sequelize;
  } catch (error) {
    console.warn(`[Database] PostgreSQL connection failed: ${error.message}`);
    console.warn(`[Database] Falling back to SQLite local storage for uninterrupted execution...`);
    
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'empoway.sqlite'),
      logging: false
    });
    
    await sequelize.authenticate();
    console.log(`[Database] Connected to fallback SQLite database successfully.`);
    return sequelize;
  }
};

module.exports = {
  sequelize,
  initDatabase
};

