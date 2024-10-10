'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.EventDocument, {
        foreignKey: 'event_id',
      });
      this.hasMany(models.EventComment, {
        foreignKey: 'event_id',
      });
      this.hasMany(models.EventSuggestion, {
        foreignKey: 'event_id',
      });
      this.hasOne(models.EventPrepare, {
        foreignKey: 'event_id',
      });
      this.hasOne(models.EventFeedback, {
        foreignKey: 'event_id',
      });
    }
  }
  Event.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      year: {
        type: DataTypes.INTEGER,
      },
      month: {
        type: DataTypes.INTEGER,
      },
      term: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
      },
      event_date: {
        type: DataTypes.DATEONLY,
      },
      number_file_success: {
        type: DataTypes.INTEGER,
      },
      number_file_reject: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: 'events',
      modelName: 'Event',
    }
  );
  Event.inputSchema = {
    code: 'required',
  };
  return Event;
};
