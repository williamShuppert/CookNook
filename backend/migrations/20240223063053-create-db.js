'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE users (
          id char(36) NOT NULL,
          email varchar(255) DEFAULT NULL,
          username varchar(50) NOT NULL,
          password varchar(255) DEFAULT NULL,
          createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          lastUpdated datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          emailVerified bool DEFAULT FALSE,
          PRIMARY KEY (id),
          UNIQUE KEY username (username),
          UNIQUE KEY email (email)
        );`, {transaction: t})
      ]))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('users', {transaction: t})
    ]))
  }
};
