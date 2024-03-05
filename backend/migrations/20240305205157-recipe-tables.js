'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.sequelize.query(`
        CREATE TABLE recipes (
          recipe_id UUID PRIMARY KEY,
          author_id UUID NOT NULL REFERENCES users(user_id),
          name TEXT NOT NULL CONSTRAINT namechk CHECK (char_length(name) <= 100),
          ratings_count INT NOT NULL DEFAULT 0,
          ratings_sum INT NOT NULL DEFAULT 0,
          bookmarks INT NOT NULL DEFAULT 0,
          prep_time INTERVAL NOT NULL,
          cook_time INTERVAL NOT NULL,
          description TEXT DEFAULT NULL,
          ingredients TEXT[] NOT NULL,
          instructions TEXT[] NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );`, {transaction: t}),
        queryInterface.sequelize.query(`
        CREATE TABLE tags (
          tag_id SERIAL PRIMARY KEY,
          tag_name TEXT UNIQUE NOT NULL CONSTRAINT namechk CHECK (char_length(tag_name) <= 50)
        );`, {transaction: t}),
        queryInterface.sequelize.query(`
        CREATE TABLE recipe_tags (
          recipe_id UUID REFERENCES recipes(recipe_id) ON DELETE CASCADE,
          tag_id INT REFERENCES tags(tag_id)
        );`, {transaction: t}),
    ]))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('recipe_tags', {transaction: t}),
      queryInterface.dropTable('tags', {transaction: t}),
      queryInterface.dropTable('recipes', {transaction: t}),
    ]))
  }
};
