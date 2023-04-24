'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = 'Venues';
        await queryInterface.bulkInsert(options, [
            {
                groupId: 1,
                address: "324 Corp Office, Amarr Imperial Academy, AM",
                city: "Amarr",
                state: "Khador",
                lat: 42.55,
                lng: 12.42
            },
            {
                groupId: 2,
                address: "23 Unknown, Place, GL",
                city: "Los Angeles",
                state: "California",
                lat: 34.5,
                lng: 84.3
            },
            {
                groupId: 3,
                address: "Jove Empire",
                city: "Hedion",
                state: "South Dakota",
                lat: -10.3,
                lng: -14.2
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'Venues';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
