// models/User.js
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

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
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  return User;
};

export default UserModel;