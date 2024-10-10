'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING(191),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
        },
        password: Sequelize.STRING,
        salt: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        phone: Sequelize.STRING,
        refresh_token: Sequelize.STRING,
        refresh_token_expire_at: Sequelize.DATE,
        password_reset_token: Sequelize.STRING,
        password_reset_expire_at: Sequelize.DATE,
        password_created_at: {
          type: Sequelize.DATE,
        },
        role: {
          type: Sequelize.ENUM('council', 'association'), // สภา, สมาคม
          defaultValue: 'council',
        },
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
      .then(() => queryInterface.addIndex('users', ['email']));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
