'use strict';

let options = {};
if (process.env.NODE_ENV === 'production')
{
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize)
    {
        options.tableName = 'Events';
        await queryInterface.bulkInsert(options, [
            {
                venueId: 1,
                groupId: 1,
                name: "Refit ships",
                description: "Get better modules",
                type: "In Person",
                capacity: 15,
                price: 10,
                startDate: new Date(2023, 4, 29),
                endDate: new Date(2023, 4, 29)
            },
            {
                venueId: 2,
                groupId: 3,
                name: "Laser show",
                description: "Load all the different ones on purpose",
                type: "In Person",
                capacity: 6,
                price: 149,
                startDate: new Date(2023, 6, 30),
                endDate: new Date(2023, 6, 30)
            },
            {
                venueId: 3,
                groupId: 2,
                name: "It's gonna be",
                description: "MAY",
                type: "Online",
                capacity: 300,
                price: 1,
                startDate: new Date(2023, 4, 30),
                endDate: new Date(2023, 4, 30)
            }
            ,
            {
                venueId: 3,
                groupId: 4,
                name: "Magic",
                description: "the Gathering",
                type: "Online",
                capacity: 4,
                price: 26,
                startDate: new Date(2023, 8, 13),
                endDate: new Date(2023, 8, 14)
            }
            ,
            {
                groupId: 4,
                name: "Magic again",
                description: "the second Gathering",
                type: "Online",
                capacity: 14,
                price: 216,
                startDate: new Date(2123, 8, 13),
                endDate: new Date(2123, 8, 14)
            }
        ], {})
    },

    async down(queryInterface, Sequelize)
    {
        options.tableName = 'Events';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
