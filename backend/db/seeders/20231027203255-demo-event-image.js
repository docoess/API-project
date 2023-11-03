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
        url: 'image url',
        preview: true
      },
      {
        eventId: 1,
        url: 'image url',
        preview: true
      },
      {
        eventId: 2,
        url: 'image url',
        preview: true
      },
      {
        eventId: 4,
        url: 'image url',
        preview: true
      },
      {
        eventId: 5,
        url: 'image url',
        preview: true
      },
      {
        eventId: 6,
        url: 'image url',
        preview: true
      },
      {
        eventId: 7,
        url: 'image url',
        preview: true
      },
      {
        eventId: 8,
        url: 'image url',
        preview: true
      },
      {
        eventId: 9,
        url: 'image url',
        preview: true
      },
      {
        eventId: 10,
        url: 'image url',
        preview: true
      },
      {
        eventId: 11,
        url: 'image url',
        preview: true
      },
      {
        eventId: 12,
        url: 'image url',
        preview: true
      },
      {
        eventId: 13,
        url: 'image url',
        preview: true
      },
      {
        eventId: 14,
        url: 'image url',
        preview: true
      },
      {
        eventId: 15,
        url: 'image url',
        preview: true
      },
      {
        eventId: 16,
        url: 'image url',
        preview: true
      },
      {
        eventId: 17,
        url: 'image url',
        preview: true
      },
      {
        eventId: 18,
        url: 'image url',
        preview: true
      },
      {
        eventId: 19,
        url: 'image url',
        preview: true
      },
      {
        eventId: 20,
        url: 'image url',
        preview: true
      },
      {
        eventId: 21,
        url: 'image url',
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
