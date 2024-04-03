"use strict";

/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedArray = [
  {
    spotId: 1,
    userId: 3,
    review: "Great experience, would highly recommend!",
    stars: 5,
  },
  {
    spotId: 2,
    userId: 2,
    review: "Nice place, had a good time.",
    stars: 4,
  },
  {
    spotId: 3,
    userId: 3,
    review: "Not bad, but could be better.",
    stars: 3,
  },
  {
    spotId: 4,
    userId: 4,
    review: "Could use some improvements.",
    stars: 3,
  },
  {
    spotId: 5,
    userId: 5,
    review: "Disappointing experience, wouldn't recommend.",
    stars: 2,
  },
  {
    spotId: 6,
    userId: 6,
    review: "Absolutely amazing!",
    stars: 5,
  },
  {
    spotId: 7,
    userId: 7,
    review: "Decent place to visit.",
    stars: 3,
  },
  {
    spotId: 8,
    userId: 8,
    review: "Not worth the hype.",
    stars: 2,
  },
  {
    spotId: 9,
    userId: 9,
    review: "Overrated.",
    stars: 2,
  },
  {
    spotId: 10,
    userId: 10,
    review: "Could be better, could be worse.",
    stars: 3,
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

    await Review.bulkCreate(seedArray, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options, null, {});
  },
};
