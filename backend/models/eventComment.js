'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class EventComment extends Model {
    static associate(models) {
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  EventComment.init(
    {
      comment: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING,
        // Event Proposal Document
        // บนศ.1
        // Advanced Payment
        // บนศ.2
        // Participants
        // Documents
        // Financial Documents
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
      tableName: 'event_comments',
      modelName: 'EventComment',
    }
  );
  return EventComment;
};
