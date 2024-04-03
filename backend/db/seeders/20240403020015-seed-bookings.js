"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const seedArray = [
  {
    spotId: 1,
    userId: 4,
    startDate: new Date(Date.UTC(2024, 10, 1)), // November 1, 2024
    endDate: new Date(Date.UTC(2024, 10, 5)), // November 5, 2024
  },
  {
    spotId: 2,
    userId: 2,
    startDate: new Date(Date.UTC(2024, 10, 2)), // November 2, 2024
    endDate: new Date(Date.UTC(2024, 10, 6)), // November 6, 2024
  },
  {
    spotId: 3,
    userId: 3,
    startDate: new Date(Date.UTC(2024, 10, 3)), // November 3, 2024
    endDate: new Date(Date.UTC(2024, 10, 7)), // November 7, 2024
  },
  {
    spotId: 4,
    userId: 4,
    startDate: new Date(Date.UTC(2024, 10, 4)), // November 4, 2024
    endDate: new Date(Date.UTC(2024, 10, 8)), // November 8, 2024
  },
  {
    spotId: 5,
    userId: 5,
    startDate: new Date(Date.UTC(2024, 10, 5)), // November 5, 2024
    endDate: new Date(Date.UTC(2024, 10, 9)), // November 9, 2024
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate(seedArray, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "Bookings";
    await queryInterface.bulkDelete(options, null, {});
  },
};
