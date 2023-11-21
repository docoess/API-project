'use strict';

const { EventImage } = require('../models');

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

    await EventImage.bulkCreate([
      {
        eventId: 3,
        url: 'https://i.imgur.com/5fNttkE.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://i.imgur.com/RXhcfS9.jpg',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://i.imgur.com/nBI55V3.png',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://i.imgur.com/rAOZKOB.jpg',
        preview: true
      },
      {
        eventId: 6,
        url: 'https://i.imgur.com/nBI55V3.png',
        preview: true
      },
      {
        eventId: 7,
        url: 'https://i.imgur.com/49NutHe.jpg',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://i.imgur.com/k5HudmG.jpg',
        preview: true
      },
      {
        eventId: 9,
        url: 'https://i.imgur.com/49NutHe.jpg',
        preview: true
      },
      {
        eventId: 10,
        url: 'https://i.imgur.com/rAOZKOB.jpg',
        preview: true
      },
      {
        eventId: 11,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 12,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 13,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 14,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 15,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 16,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 17,
        url: 'https://i.imgur.com/1zwFAtQ.jpg',
        preview: true
      },
      {
        eventId: 18,
        url: 'https://i.imgur.com/k5HudmG.jpg',
        preview: true
      },
      {
        eventId: 19,
        url: 'https://i.imgur.com/k5HudmG.jpg',
        preview: true
      },
      {
        eventId: 20,
        url: 'https://i.imgur.com/nBI55V3.png',
        preview: true
      },
      {
        eventId: 21,
        url: 'https://i.imgur.com/RXhcfS9.jpg',
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
    options.tableName = 'EventImages';
    return queryInterface.bulkDelete(options, {
      preview: true
    }, {});
  }
};
