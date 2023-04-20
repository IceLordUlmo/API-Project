'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = 'GroupImages';
        await queryInterface.bulkInsert(options, [
            {
                groupId: 1,
                url: "f@z.com",
                preview: true
            },
            {
                groupId: 1,
                url: "g@z.com",
                preview: false
            },
            {
                groupId: 2,
                url: "h@z.com",
                preview: true
            },
            {
                groupId: 2,
                url: "i@z.com",
                preview: false
            },
            {
                groupId: 3,
                url: "j@z.com",
                preview: true
            },
            {
                groupId: 3,
                url: "k@z.com",
                preview: false
            },
            {
                groupId: 4,
                url: "l@z.com",
                preview: false
            },
            {
                groupId: 4,
                url: "m@z.com",
                preview: false
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'GroupImages';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
