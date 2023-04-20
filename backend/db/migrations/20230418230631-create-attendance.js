'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Events"
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users"
        }
      },
      status: {
        type: Sequelize.ENUM('attending', 'waitlist', 'pending')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.dropTable(options);
  }
};
