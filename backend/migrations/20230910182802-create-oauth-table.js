'use strict';
const {DataTypes} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('oauth', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: 'compositeIndex',
        references: {
            model: 'users',
            key: 'id'
        }
      },
      provider: {
          type: DataTypes.STRING,
          unique: 'compositeIndex',
          allowNull: false
      },
      id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('oauth')
  }
};
