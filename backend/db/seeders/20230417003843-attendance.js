'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = 'Attendances';
        await queryInterface.bulkInsert(options, [
            {
                eventId: 1,
                userId: 1,
                status: "pending"
            },
            {
                eventId: 1,
                userId: 2,
                status: "waitlist"
            },
            {
                eventId: 2,
                userId: 3,
                status: "attending"
            },
            {
                eventId: 4,
                userId: 3,
                status: "waitlist"
            },
            {
                eventId: 3,
                userId: 2,
                status: "attending"
            },
            {
                eventId: 3,
                userId: 3,
                status: "attending"
            },
            {
                eventId: 2,
                userId: 4,
                status: "attending"
            },
            {
                eventId: 1,
                userId: 4,
                status: "attending"
            }
        ], {})

    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'Attendances';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
