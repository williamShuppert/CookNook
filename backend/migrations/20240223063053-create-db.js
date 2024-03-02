'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE users (
          user_id UUID PRIMARY KEY,
          email varchar(255) UNIQUE DEFAULT NULL,
          username varchar(50) NOT NULL UNIQUE,
          password varchar(255) DEFAULT NULL,
          google_id varchar(21) UNIQUE DEFAULT NULL,
          created_at timestamp default current_timestamp,
          updated_at timestamp default current_timestamp,
          email_verified bool DEFAULT FALSE
        );`, {transaction: t}),
      queryInterface.sequelize.query(`
        CREATE TABLE refresh_tokens (
          token_id UUID NOT NULL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          expires_at timestamp NOT NULL
        );`, {transaction: t}),
      queryInterface.sequelize.query(`
        CREATE TABLE errors (
          error_id SERIAL PRIMARY KEY,
          message TEXT,
          stack TEXT,
          date timestamp default current_timestamp
        );`, {transaction: t}),
      ]))
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('refresh_tokens', {transaction: t}),
      queryInterface.dropTable('users', {transaction: t}),
      queryInterface.dropTable('errors', {transaction: t}),
    ]))
  }
};
