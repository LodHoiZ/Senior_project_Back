'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class EventPrepare extends Model {
    static associate(models) {
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.Prepare, {
        foreignKey: 'event_prepare_id',
      });
    }
  }
  EventPrepare.init(
    {
      comment: {
        type: DataTypes.TEXT,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      event_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: 'event_prepares',
      modelName: 'EventPrepare',
    }
  );
  return EventPrepare;
};
