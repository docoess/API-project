'use strict';

const { Venue } = require('../models');

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

   await Venue.bulkCreate([
    {
      groupId: 1,
      address: '123 Fake Street',
      city: 'Portland',
      state: 'OR',
      lat: 45.5152,
      lng: -122.6784
    },
    {
      groupId: 2,
      address: '612 Wharf Ave',
      city: 'Portland',
      state: 'OR',
      lat: 45.5152,
      lng: -122.6784
    },
    {
      groupId: 3,
      address: '1000 Colonial Farm Road',
      city: 'Langley',
      state: 'VA',
      lat: 38.9465,
      lng: -77.1589
    },
    {
      groupId: 4,
      address: '333 California Road',
      city: 'Los Angeles',
      state: 'OR',
      lat: 34.0549,
      lng: -118.2426
    },
    {
      groupId: 5,
      address: '77 Massachusetts Ave',
      city: 'Cambridge',
      state: 'MA',
      lat: 42.3601,
      lng: -71.0942
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Fake Street', '612 Wharf Ave', '1000 Colonial Farm Road', '333 California Road', '77 Massachusetts Ave']}
    }, {});
  }
};
