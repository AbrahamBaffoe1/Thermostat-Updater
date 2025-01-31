const { Sequelize } = require('sequelize');
const defineUser = require('./User');
const defineThermostat = require('./Thermostat');
const defineTemperatureHistory = require('./TemperatureHistory');
require('dotenv').config();

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
const TemperatureHistory = defineTemperatureHistory(sequelize);

// Setup associations
User.hasMany(Thermostat, {
  foreignKey: 'user_id',
  as: 'thermostats',
  onDelete: 'CASCADE'
});

Thermostat.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

Thermostat.hasMany(TemperatureHistory, {
  foreignKey: 'thermostat_id',
  as: 'history',
  onDelete: 'CASCADE'
});

TemperatureHistory.belongsTo(Thermostat, {
  foreignKey: 'thermostat_id',
  as: 'thermostat',
  onDelete: 'CASCADE'
});

// Initialize Database
const initDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

sequelize.initDatabase = initDatabase;

module.exports = {
  sequelize,
  User,
  Thermostat,
  TemperatureHistory
};
