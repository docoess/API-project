'use strict';

const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://i.imgur.com/RXhcfS9.jpg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://i.imgur.com/5fNttkE.jpg',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://i.imgur.com/nBI55V3.png',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://i.imgur.com/rAOZKOB.jpg',
        preview: true
      },
      {
        groupId: 6,
        url: 'https://i.imgur.com/pMdVANq.jpg',
        preview: true
      },
      {
        groupId: 7,
        url: 'https://i.imgur.com/k5HudmG.jpg',
        preview: true
      },
      {
        groupId: 8,
        url: 'https://i.imgur.com/49NutHe.jpg',
        preview: true
      },
      {
        groupId: 9,
        url: 'https://i.imgur.com/rAOZKOB.jpg',
        preview: true
      },
      {
        groupId: 10,
        url: 'https://i.imgur.com/nBI55V3.png',
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }, {});
  }
};
