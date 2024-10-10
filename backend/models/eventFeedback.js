'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class EventFeedback extends Model {
    static associate(models) {
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  EventFeedback.init(
    {
      feedback: {
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
      tableName: 'event_feedbacks',
      modelName: 'EventFeedback',
    }
  );
  return EventFeedback;
};
