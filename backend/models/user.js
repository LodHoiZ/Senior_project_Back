'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.AccessToken, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.Event, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.EventComment, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.EventSuggestion, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.EventPrepare, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.EventFeedback, {
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phone: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      refresh_token_expire_at: DataTypes.DATE,
      password_reset_token: DataTypes.STRING,
      password_reset_expire_at: DataTypes.DATE,
      password_created_at: {
        type: DataTypes.DATE,
      },
      role: {
        type: DataTypes.ENUM('council', 'association'), // สภา, สโม
        defaultValue: 'council',
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          const salt = bcryptjs.genSaltSync(10);
          user.salt = salt;
          user.password = bcryptjs.hashSync(user.password, salt);
        },
      },
      sequelize,
      underscored: true,
      tableName: 'users',
      modelName: 'User',
    }
  );
  User.inputSchema = {
    email: 'required',
    username: 'required',
    password: 'required',
  };
  User.prototype.validPassword = function (password) {
    return bcryptjs.compareSync(password, this.password);
  };
  User.prototype.validAuthToken = function (authToken) {
    return this.auth_token === authToken;
  };
  return User;
};
