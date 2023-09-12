'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          email VARCHAR(255) UNIQUE,
          username VARCHAR(50) UNIQUE NOT NULL,
          displayname VARCHAR(50) NOT NULL,
          password VARCHAR(255),
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
};
