'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Amarr",
        about: "Have faith in armor and lasers.",
        type: "In Person",
        private: false,
        city: "Hedion",
        state: "New York"
      },
      {
        organizerId: 2,
        name: "Minmatar",
        about: "In rust we trust!",
        type: "In Person",
        private: false,
        city: "Hek",
        state: "Ammatar"
      },
      {
        organizerId: 3,
        name: "Caldari",
        about: "We like missiles.",
        type: "Online",
        private: true,
        city: "Malchizedek",
        state: "Ofmind"
      },
      {
        organizerId: 4,
        name: "Gallente",
        about: "Don't leave your drones behind",
        type: "Online",
        private: true,
        city: "Kronos",
        state: "Atron"
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';

    await queryInterface.bulkDelete(options);
  }
};
