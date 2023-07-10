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
        options.tableName = 'EventImages';
        await queryInterface.bulkInsert(options, [
            {
                eventId: 1,
                url: "https://wiki.eveuniversity.org/images/thumb/e/ef/Venture.jpg/256px-Venture.jpg",
                preview: true
            },
            {
                eventId: 1,
                url: "https://wiki.eveuniversity.org/images/thumb/2/25/Retriever.jpg/256px-Retriever.jpg",
                preview: false
            },
            {
                eventId: 2,
                url: "https://wiki.eveuniversity.org/images/thumb/6/6b/Covetor.jpg/256px-Covetor.jpg",
                preview: true
            },
            {
                eventId: 2,
                url: "https://wiki.eveuniversity.org/images/thumb/9/93/Procurer.jpg/256px-Procurer.jpg",
                preview: true
            },
            {
                eventId: 3,
                url: "https://wiki.eveuniversity.org/images/thumb/7/71/Skiff.jpg/256px-Skiff.jpg",
                preview: true
            },
            {
                eventId: 5,
                url: "https://wiki.eveuniversity.org/images/thumb/c/c7/Mackinaw.jpg/256px-Mackinaw.jpg",
                preview: true
            }
            ,
            {
                eventId: 4,
                url: "https://wiki.eveuniversity.org/images/thumb/3/31/Prospect.jpg/256px-Prospect.jpg",
                preview: true
            }
        ], {})
    },

    async down(queryInterface, Sequelize)
    {
        options.tableName = 'EventImages';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
