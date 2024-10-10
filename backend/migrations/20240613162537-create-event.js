'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('events', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        year: {
          type: Sequelize.INTEGER,
        },
        month: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        user_id: {
          type: Sequelize.INTEGER,
        },
        status: {
          type: Sequelize.STRING,
        },
        event_date: {
          type: Sequelize.DATEONLY,
        },
        createdAt: {
          allowNull: false,
          field: 'created_at',
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          field: 'updated_at',
          type: Sequelize.DATE,
        },
      })
      .then(() => queryInterface.addIndex('events', ['code']));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events');
  },
};
