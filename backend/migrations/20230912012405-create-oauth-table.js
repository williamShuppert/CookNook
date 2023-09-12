'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE oauth (
        providerUserId VARCHAR(255) NOT NULL,
          providerName VARCHAR(10) NOT NULL,
          userId VARCHAR(36) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (userId, providerName),
          PRIMARY KEY (providerName, providerUserId)
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
};
