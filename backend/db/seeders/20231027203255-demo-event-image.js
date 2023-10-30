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
        preview: false
      },
      {
        eventId: 1,
        url: 'image url',
        preview: true
      },
      {
        eventId: 2,
        url: 'image url',
        preview: false
      },
      {
        eventId: 4,
        url: 'image url',
        preview: false
      },
      {
        eventId: 5,
        url: 'image url',
        preview: true
      },
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5]}
    }, {});
  }
};
