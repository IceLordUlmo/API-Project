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
        options.tableName = 'GroupImages';
        await queryInterface.bulkInsert(options, [
            {
                groupId: 1,
                url: "https://wiki.eveuniversity.org/images/a/a0/Logo_faction_amarr_empire.png",
                preview: true
            },
            {
                groupId: 1,
                url: "https://wiki.eveuniversity.org/images/thumb/3/37/House_khanid.png/64px-House_khanid.png",
                preview: false
            },
            {
                groupId: 2,
                url: "https://wiki.eveuniversity.org/images/1/1f/Logo_faction_minmatar_republic.png",
                preview: true
            },
            {
                groupId: 2,
                url: "https://wiki.eveuniversity.org/images/thumb/c/c4/Icon_decal_thukker.png/64px-Icon_decal_thukker.png",
                preview: false
            },
            {
                groupId: 3,
                url: "https://wiki.eveuniversity.org/images/e/e3/Logo_faction_caldari_state.png",
                preview: true
            },
            {
                groupId: 3,
                url: "https://wiki.eveuniversity.org/images/thumb/6/62/Drake.jpg/256px-Drake.jpg",
                preview: false
            },
            {
                groupId: 4,
                url: "https://wiki.eveuniversity.org/images/b/b9/Logo_faction_gallente_federation.png",
                preview: true
            },
            {
                groupId: 4,
                url: "https://wiki.eveuniversity.org/images/thumb/d/d9/Vexor.jpg/256px-Vexor.jpg",
                preview: false
            }
        ], {})
    },

    async down(queryInterface, Sequelize)
    {
        options.tableName = 'GroupImages';
        const Op = Sequelize.Op;
        await queryInterface.bulkDelete(options);
    }
};
