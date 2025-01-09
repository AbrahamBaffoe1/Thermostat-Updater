// models/Thermostat.js
import { Model, DataTypes } from 'sequelize';

const ThermostatModel = (sequelize) => {
  class Thermostat extends Model {
    static associate(models) {
      Thermostat.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Thermostat.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    currentTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 20.0,
      validate: {
        min: 0,
        max: 40,
      },
    },
    targetTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 22.0,
      validate: {
        min: 15,
        max: 30,
      },
    },
    mode: {
      type: DataTypes.ENUM('heat', 'cool', 'off'),
      allowNull: false,
      defaultValue: 'off',
    },
    zone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Main Zone',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Thermostat',
    hooks: {
      beforeValidate: (thermostat) => {
        if (thermostat.currentTemperature) {
          thermostat.currentTemperature = parseFloat(thermostat.currentTemperature.toFixed(1));
        }
        if (thermostat.targetTemperature) {
          thermostat.targetTemperature = parseFloat(thermostat.targetTemperature.toFixed(1));
        }
      },
    },
  });

  return Thermostat;
};

export default ThermostatModel;