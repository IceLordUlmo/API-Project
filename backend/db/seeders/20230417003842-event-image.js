'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = 'EventImages';
        await queryInterface.bulkInsert(options, [
            {
                eventId: 1,
                url: "x@y.com",
                preview: true
            },
            {
                eventId: 1,
                url: "a@y.com",
                preview: false
            },
            {
                eventId: 2,
                url: "b@y.com",
                preview: true
            },
            {
                eventId: 2,
                url: "c@y.com",
                preview: true
            },
            {
                eventId: 3,
                url: "d@y.com",
                preview: false
            },
            {
                eventId: 3,
                url: "e@y.com",
                preview: false
            }
            ,
            {
                eventId: 4,
                url: "f@z.com",
                preview: false
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'EventImages';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
