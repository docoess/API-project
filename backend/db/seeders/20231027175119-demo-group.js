'use strict';

const { Group } = require('../models');

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
  }
};
