'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class EventDocument extends Model {
    static associate(models) {
      this.belongsTo(models.Event, {
        foreignKey: 'event_id',
      });
    }
  }
  EventDocument.init(
    {
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
      url: {
        type: DataTypes.STRING, // file name
      },
      type_document: {
        type: DataTypes.STRING, // pdf
      },
      status: {
        type: DataTypes.ENUM('revising', 'rejected', 'completed'),
        defaultValue: 'revising',
      },
      event_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: 'event_documents',
      modelName: 'EventDocument',
    }
  );
  return EventDocument;
};
