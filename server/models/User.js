// models/User.js
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const UserModel = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Thermostat, {
        foreignKey: 'user_id',
        as: 'thermostats',
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    underscored: true,
  });

  // Method to validate password
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return User;
};

export default UserModel;