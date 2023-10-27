'use strict';

const { Event } = require('../models');

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

    await Event.bulkCreate([
      {
        venueId: null,
        groupId: 1,
        name: 'Coding 101: Getting Started',
        description: 'Learn the basics of HTML, CSS, and JavaScript with us!',
        type: 'Online',
        capacity: 10,
        price: 5,
        startDate: '2023-11-26 16:00:00',
        endDate: '2023-11-26 21:00:00'
      },
      {
        venueId: null,
        groupId: 2,
        name: 'Minecraft Server Slam',
        description: 'Come push our Minecraft server to its limits. The more the merrier!',
        type: 'Online',
        capacity: 8,
        price: 2,
        startDate: '2023-12-26 12:00:00',
        endDate: '2023-12-29 12:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'REDACTED EVENT',
        description: 'Do not come and not do secret stuff not involving foreign governments!',
        type: 'In person',
        capacity: 700,
        price: 1000,
        startDate: '2023-12-31 23:59:00',
        endDate: '2024-01-01 00:01:00'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Definitely Not Robbing A Bank Party',
        description: 'Come join us at the bank where we will certainly be legally withdrawing funds! Bring your wallet!',
        type: 'In person',
        capacity: 42,
        price: 50,
        startDate: '2024-03-15 12:00:00',
        endDate: '2024-03-15 12:15:00'
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Earn Your Humanity Party!',
        description: 'Come party in an elecrtical storm and be shocked by how sentient you can become!',
        type: 'In person',
        capacity: 5,
        price: 5,
        startDate: '2050-05-05 05:00:00',
        endDate:  '2050-05-05 17:00:00'
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Coding 101: Getting Started',
                        'Minecraft Server Slam',
                        'REDACTED EVENT',
                        'Definitely Not Robbing A Bank Party',
                        'Earn Your Humanity Party!']}
    }, {});
  }
};
