import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Thermostat extends Model {
    static associate(models) {
      Thermostat.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Thermostat.hasMany(models.TemperatureHistory, {
        foreignKey: 'thermostat_id',
        as: 'history',
      });
    }
  }

  Thermostat.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Main Thermostat',
      validate: {
        notEmpty: true,
      },
    },
    current_temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 20.0,
      field: 'current_temperature',
      validate: {
        min: 0,
        max: 40,
      },
    },
    target_temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 22.0,
      field: 'target_temperature',
      validate: {
        min: 15,
        max: 30,
      },
    },
    mode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'off',
      validate: {
        isIn: [['heat', 'cool', 'off']]
      }
    },
    zone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Main Zone',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_active',
      defaultValue: true,
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      field: 'user_id',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Thermostat',
    tableName: 'thermostats',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (thermostat) => {
        if (thermostat.current_temperature) {
          thermostat.current_temperature = parseFloat(thermostat.current_temperature.toFixed(1));
        }
        if (thermostat.target_temperature) {
          thermostat.target_temperature = parseFloat(thermostat.target_temperature.toFixed(1));
        }
      },
    },
  });

  return Thermostat;
};
