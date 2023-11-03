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
        url: 'image url',
        preview: true
      },
      {
        groupId: 2,
        url: 'image url',
        preview: true
      },
      {
        groupId: 3,
        url: 'image url',
        preview: true
      },
      {
        groupId: 4,
        url: 'image url',
        preview: true
      },
      {
        groupId: 5,
        url: 'image url',
        preview: true
      },
      {
        groupId: 6,
        url: 'image url',
        preview: true
      },
      {
        groupId: 7,
        url: 'image url',
        preview: true
      },
      {
        groupId: 8,
        url: 'image url',
        preview: true
      },
      {
        groupId: 9,
        url: 'image url',
        preview: true
      },
      {
        groupId: 10,
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5]}
    }, {});
  }
};
