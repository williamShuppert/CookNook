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
        );`, {transaction: t}),
      queryInterface.sequelize.query(`
        CREATE TABLE oauth_providers (
          id INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(10) UNIQUE
        );`, {transaction: t}),
      queryInterface.sequelize.query(`
        INSERT INTO oauth_providers (name) VALUES ('google');`,
        {transaction: t}),
      queryInterface.sequelize.query(`
        CREATE TABLE oauth (
          providerId INT NOT NULL,
          providerUserId VARCHAR(255) NOT NULL,
          userId VARCHAR(36) NOT NULL,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (userId, providerId),
          PRIMARY KEY (providerId, providerUserId),
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (providerId) REFERENCES oauth_providers(id)
        );`, {transaction: t}),
        queryInterface.sequelize.query(`
          CREATE TABLE refresh_tokens (
            id char(36) NOT NULL PRIMARY KEY,
            userId char(36) NOT NULL,
            createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          );`, {transaction: t}),
      ]))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('refresh_tokens', {transaction: t}),
      queryInterface.dropTable('oauth', {transaction: t}),
      queryInterface.dropTable('users', {transaction: t}),
      queryInterface.dropTable('oauth_providers', {transaction: t}),
    ]))
  }
};
