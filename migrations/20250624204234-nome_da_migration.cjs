'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'last_login',
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'access_token',
      },
    });
    // await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    // await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('users');
  },
};
