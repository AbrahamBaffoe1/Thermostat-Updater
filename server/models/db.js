// config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER, // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name for development
    host: process.env.DB_HOST, // Host for the database
    dialect: 'postgres', // Database dialect
    port: process.env.DB_PORT, // Database port (default is usually 5432 for PostgreSQL)
  },
  test: {
    username: process.env.DB_USER, // Database username for testing
    password: process.env.DB_PASSWORD, // Database password for testing
    database: process.env.DB_NAME_TEST, // Separate database for testing
    host: process.env.DB_HOST, // Host for the database
    dialect: 'postgres', // Database dialect
    port: process.env.DB_PORT, // Database port
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Use DATABASE_URL environment variable in production
    dialect: 'postgres', // Database dialect
    dialectOptions: {
      ssl: {
        require: true, // Require SSL
        rejectUnauthorized: false, // Do not reject unauthorized certificates
      },
    },
  },
};