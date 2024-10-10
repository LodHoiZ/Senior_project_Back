'use strict';
const db = require('../models');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await db.User.create({
      firstname: 'council',
      lastname: 'council',
      email: process.env.COUNCIL_EMAIL,
      password: process.env.COUNCIL_PASSWORD,
      role: 'council',
    });
    await db.User.create({
      firstname: 'association',
      lastname: 'association',
      email: process.env.ASSOCIATION_EMAIL,
      password: process.env.ASSOCIATION_PASSWORD,
      role: 'association',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null);
  },
};
