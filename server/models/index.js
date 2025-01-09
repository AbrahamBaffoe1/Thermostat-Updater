// models/index.js
import { Sequelize } from 'sequelize';
import defineUser from './User.js';
import defineThermostat from './Thermostat.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'thermostat_db',
  logging: false,
  dialectOptions: {
    // Only use SSL in production
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Initialize models
const User = defineUser(sequelize);
const Thermostat = defineThermostat(sequelize);

// Setup associations
User.hasMany(Thermostat, {
  foreignKey: 'userId',
  as: 'thermostats'
});

Thermostat.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

export { sequelize, User, Thermostat };