"use strict";
/** @type {import('sequelize-cli').Migration} */

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedArray = [
  {
    reviewId: 1,
    url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    reviewId: 2,
    url: "https://images.pexels.com/photos/2347329/pexels-photo-2347329.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 3,
    url: "https://images.pexels.com/photos/236715/pexels-photo-236715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 4,
    url: "https://images.pexels.com/photos/2129795/pexels-photo-2129795.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 5,
    url: "https://images.pexels.com/photos/3985184/pexels-photo-3985184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 6,
    url: "https://images.pexels.com/photos/3760161/pexels-photo-3760161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 7,
    url: "https://images.pexels.com/photos/2387855/pexels-photo-2387855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 8,
    url: "https://images.pexels.com/photos/2246475/pexels-photo-2246475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 9,
    url: "https://images.pexels.com/photos/2294476/pexels-photo-2294476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    reviewId: 10,
    url: "https://images.pexels.com/photos/1280/pexels-photo-1280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
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
    ReviewImage.bulkCreate(seedArray, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
