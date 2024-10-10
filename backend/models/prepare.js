'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Prepare extends Model {
    static associate(models) {
      this.belongsTo(models.EventPrepare, {
        foreignKey: 'event_prepare_id',
      });
    }
  }
  Prepare.init(
    {
      prepare: {
        type: DataTypes.TEXT,
      },
      event_prepare_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: 'prepares',
      modelName: 'Prepare',
    }
  );
  return Prepare;
};
