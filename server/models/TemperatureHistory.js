import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class TemperatureHistory extends Model {
    static associate(models) {
      TemperatureHistory.belongsTo(models.Thermostat, {
        foreignKey: 'thermostat_id',
        as: 'thermostat',
      });
    }
  }

  TemperatureHistory.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    thermostat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'thermostats',
        key: 'id'
      }
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 40
      }
    },
    target_temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 15,
        max: 30
      }
    },
    mode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['heat', 'cool', 'off']]
      }
    },
    energy_usage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'TemperatureHistory',
    tableName: 'temperature_history',
    underscored: true,
    timestamps: false,
    hooks: {
      beforeValidate: (history) => {
        if (history.temperature) {
          history.temperature = parseFloat(history.temperature.toFixed(1));
        }
        if (history.target_temperature) {
          history.target_temperature = parseFloat(history.target_temperature.toFixed(1));
        }
        if (history.energy_usage) {
          history.energy_usage = parseFloat(history.energy_usage.toFixed(2));
        }
      }
    }
  });

  return TemperatureHistory;
};
