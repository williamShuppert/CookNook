'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
        queryInterface.sequelize.query(`
          CREATE TABLE users (
            id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
            email VARCHAR(255) UNIQUE,
            username VARCHAR(50) UNIQUE NOT NULL,
            displayname VARCHAR(50) NOT NULL,
            password VARCHAR(255),
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          );`, {transaction: t}),
        queryInterface.sequelize.query(`
         CREATE TABLE oauth_providers (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(10) UNIQUE
          );
        `, {transaction: t}),
        queryInterface.sequelize.query(`
          CREATE TABLE oauth (
            providerUserId VARCHAR(255) NOT NULL,
              providerId INT NOT NULL,
              userId VARCHAR(36) NOT NULL,
              createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              UNIQUE (userId, providerId),
              PRIMARY KEY (providerId, providerUserId),
              FOREIGN KEY (userId) REFERENCES users(id),
              FOREIGN KEY (providerId) REFERENCES oauth_providers(id)
          );
        `, {transaction: t}),
        queryInterface.sequelize.query(`
          CREATE TRIGGER prevent_null_password_without_oauth
          BEFORE UPDATE ON users
          FOR EACH ROW
          BEGIN
            DECLARE oauthCount INT;
              SET oauthCount = 0;
              
            IF NEW.password IS NULL THEN
              SELECT COUNT(*) INTO oauthCount FROM oauth WHERE userId = NEW.id;
                  
                  IF oauthCount = 0 THEN
                SIGNAL SQLSTATE '45000' -- This is a user-defined exception
                SET MESSAGE_TEXT = 'Update operation canceled due to minimum auth methods';
                  END IF;
            END IF;
          END
        `, {transaction: t}),
        queryInterface.sequelize.query(`
          CREATE TRIGGER prevent_no_oauth_without_password
          BEFORE DELETE ON oauth
          FOR EACH ROW
          BEGIN
            DECLARE userPassword VARCHAR(36);
              DECLARE oauthCount INT;
              SET userPassword = NULL;
              SET oauthCount = 0;
              
              SELECT password INTO userPassword FROM users WHERE id = OLD.userId;
              SELECT COUNT(*) INTO oauthCount FROM oauth WHERE userId = OLD.userId;
              
            IF userPassword IS NULL AND oauthCount = 1 THEN
              SIGNAL SQLSTATE '45000' -- This is a user-defined exception
              SET MESSAGE_TEXT = 'Update operation canceled due to minimum auth methods';
            END IF;
          END
        `, {transaction: t})
      ]))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.sequelize.query('DROP TRIGGER prevent_null_password_without_oauth', {transaction: t}),
      queryInterface.sequelize.query('DROP TRIGGER prevent_no_oauth_without_password', {transaction: t}),
      queryInterface.dropTable('oauth', {transaction: t}),
      queryInterface.dropTable('oauth_providers', {transaction: t}),
      queryInterface.dropTable('users', {transaction: t}),
    ]))
  }
};