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
  as: 'thermostats',
  onDelete: 'CASCADE'
});

Thermostat.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
});

// Initialize Database
const initDatabase = async () => {
  try {
    // First, sync User model
    await User.sync({ force: true });
    console.log('Users table created');

    // Then, sync Thermostat model
    await Thermostat.sync({ force: true });
    console.log('Thermostats table created');

    console.log('All tables synchronized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

sequelize.initDatabase = initDatabase;

export { sequelize, User, Thermostat };