'use strict';

const { Group } = require('../models');

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

    await Group.bulkCreate([
      {
        organizerId: 4,
        name: 'Junior WebDev Camp People',
        about: 'This is where all junior full-stack people can come together to work on improving their skills.',
        type: 'Online',
        private: false,
        city: 'Portland',
        state: 'OR'
      },
      {
        organizerId: 4,
        name: 'Gamers Unite',
        about: 'A group for gamers of all types, from casual to hardcore. All genres accepted.',
        type: 'Online',
        private: false,
        city: 'Portland',
        state: 'OR'
      },
      {
        organizerId: 1,
        name: 'Super Secret People Club',
        about: 'You would love to know what we do, but that is private info for members only!',
        type: 'In person',
        private: true,
        city: 'Langley',
        state: 'VA'
      },
      {
        organizerId: 3,
        name: 'Criminal Club',
        about: 'We love faking credentials for different things. Come join for lots of fun!',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'CA'
      },
      {
        organizerId: 5,
        name: 'Robot Club',
        about: 'The first group made for robots, by robots! Come join the collective today!',
        type: 'In person',
        private: false,
        city: 'Cambridge',
        state: 'MA'
      },
      {
        organizerId: 2,
        name: 'Lorem Ipsum Club',
        about: 'Do you like nonsensical latin? So do we! Come join and confuse people with your webpage today!',
        type: 'Online',
        private: false,
        city: 'Rome',
        state: 'IT'
      },
      {
        organizerId: 1,
        name: 'Music Lovers',
        about: 'Are you human? Do you enjoy music? Of course you do! So why not come listen with us!',
        type: 'In person',
        private: false,
        city: 'Canton',
        state: 'OH'
      },
      {
        organizerId: 4,
        name: 'Test Group Gamma',
        about: 'We have no idea what we do. Do we even exist? Join up and find out!',
        type: 'Online',
        private: false,
        city: 'Portland',
        state: 'OR'
      },
      {
        organizerId: 5,
        name: 'Robot Club: The Sequel',
        about: 'We are just like that other robot club, except newer!',
        type: 'In person',
        private: false,
        city: 'Cambridge',
        state: 'MA'
      },
      {
        organizerId: 3,
        name: 'Crime Club Redux',
        about: 'Now located in Las Vegas! Come join the heist of the century today!',
        type: 'In person',
        private: false,
        city: 'Las Vegas',
        state: 'NV'
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Junior WebDev Camp People', 'Gamers Unite', 'Super Secret People Club', 'Criminal Club', 'Robot Club']}
    }, {});
  }
};
