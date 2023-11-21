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
      state: 'CA',
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
    },
    {
      groupId: 8,
      address: '456 Faker Street',
      city: 'Portland',
      state: 'OR',
      lat: 45.5152,
      lng: -122.6784
    },
    {
      groupId: 7,
      address: 'Melody Road',
      city: 'Canton',
      state: 'OH',
      lat: 40.7989,
      lng: -81.3784
    },
    {
      groupId: 6,
      address: 'Ancient Boulevard',
      city: 'Rome',
      state: 'IT',
      lat: 41.9028,
      lng: 12.4964
    },
    {
      groupId: 9,
      address: '77 Massachusetts Ave',
      city: 'Cambridge',
      state: 'MA',
      lat: 42.3601,
      lng: -71.0942
    },
    {
      groupId: 10,
      address: '777 Luxor Avenue',
      city: 'Las Vegas',
      state: 'NV',
      lat: 36.1716,
      lng: -115.1391
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
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }, {});
  }
};
