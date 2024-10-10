'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('event_documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        // Event Proposal Document
        // บนศ.1
        // Advanced Payment
        // บนศ.2
        // Participants
        // Documents
        // Financial Documents
      },
      url: {
        type: Sequelize.STRING, // file name
      },
      type_document: {
        type: Sequelize.STRING, // pdf
      },
      status: {
        type: Sequelize.ENUM('revising', 'reject', 'complete'),
        defaultValue: 'revising',
      },
      event_id: {
        type: Sequelize.INTEGER,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('event_documents');
  },
};
