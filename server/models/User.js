// models/User.js
import { Model, DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Thermostat, {
        foreignKey: 'userId',
        as: 'thermostats',
      });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

export default UserModel;