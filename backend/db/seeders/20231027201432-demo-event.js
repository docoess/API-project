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
        startDate: '2050-11-26 16:00:00',
        endDate: '2050-11-26 21:00:00'
      },
      {
        venueId: null,
        groupId: 2,
        name: 'Minecraft Server Slam',
        description: 'Come push our Minecraft server to its limits. The more the merrier!',
        type: 'Online',
        capacity: 8,
        price: 2,
        startDate: '2050-12-26 12:00:00',
        endDate: '2050-12-29 12:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'REDACTED EVENT',
        description: 'Do not come and not do secret stuff not involving foreign governments!',
        type: 'In person',
        capacity: 700,
        price: 1000,
        startDate: '2050-12-31 23:59:00',
        endDate: '2051-01-01 00:01:00'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Definitely Not Robbing A Bank Party',
        description: 'Come join us at the bank where we will certainly be legally withdrawing funds! Bring your wallet!',
        type: 'In person',
        capacity: 42,
        price: 50,
        startDate: '2050-03-15 12:00:00',
        endDate: '2050-03-15 12:15:00'
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
      },
      {
        venueId: 10,
        groupId: 10,
        name: 'The Big One',
        description: 'Come grab your share of the loot! We guarantee it will be worth your while.',
        type: 'In person',
        capacity: 86,
        price: 0,
        startDate: '2073-11-11 11:00:00',
        endDate:  '2073-11-13 13:00:00'
      },
      {
        venueId: null,
        groupId: 6,
        name: 'Bacon Ipsum?',
        description: 'What is all this we are hearing about Bacon Ipsum?',
        type: 'Online',
        capacity: 120,
        price: 12,
        startDate: '2040-12-12 15:00:00',
        endDate:  '2040-12-15 17:30:00'
      },
      {
        venueId: 7,
        groupId: 7,
        name: 'Woodstock 2054',
        description: 'The event of the century! Come see holographic Jimi and the rest!',
        type: 'In person',
        capacity: 3000,
        price: 450,
        startDate: '2054-09-25 13:00:00',
        endDate:  '2054-09-30 23:59:00'
      },
      {
        venueId: 6,
        groupId: 8,
        name: 'We have no clue',
        description: 'Come do random stuff! We have 0 idea what this club is, and this event proves that!',
        type: 'Online',
        capacity: 20,
        price: 10,
        startDate: '2040-06-25 12:00:00',
        endDate:  '2040-06-25 17:00:00'
      },
      {
        venueId: 9,
        groupId: 9,
        name: 'Upgrade Party',
        description: 'Come get those servos fixed! Get a patch for that bug! Get a new OS! Anything!!!',
        type: 'In person',
        capacity: 42,
        price: 99,
        startDate: '2050-04-01 12:00:00',
        endDate:  '2050-04-01 19::00:00'
      },
      {
        venueId: null,
        groupId: 1,
        name: 'Coding 102: Continuing Getting Started',
        description: 'Learn some intermediate skills for JavaScript with us!',
        type: 'Online',
        capacity: 10,
        price: 5,
        startDate: '2050-12-03 16:00:00',
        endDate: '2050-12-03 21:00:00'
      },
      {
        venueId: null,
        groupId: 1,
        name: 'Coding 103: Getting Started With Node',
        description: 'Learn the basics of Node.js and even JavaScript stuff with us!',
        type: 'Online',
        capacity: 10,
        price: 5,
        startDate: '2050-12-10 16:00:00',
        endDate: '2050-12-10 21:00:00'
      },
      {
        venueId: null,
        groupId: 1,
        name: 'Coding 201: Getting Started with Python',
        description: 'Learn the basics of Python with us!',
        type: 'Online',
        capacity: 10,
        price: 5,
        startDate: '2050-12-17 16:00:00',
        endDate: '2050-12-17 21:00:00'
      },
      {
        venueId: null,
        groupId: 2,
        name: 'The Release for the 26th WoW Expansion!!!',
        description: 'Come fight Mega-Mega-Arthas and Super-Duper-Ony in the next new release!',
        type: 'Online',
        capacity: 40,
        price: 70,
        startDate: '2050-11-27 19:00:00',
        endDate: '2050-11-27 22:00:00'
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
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    }, {});
  }
};
