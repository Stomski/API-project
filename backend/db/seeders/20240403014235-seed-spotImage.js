"use strict";

const { SpotImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedArray = [
  {
    spotId: 1,
    url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    spotId: 2,
    url: "https://images.pexels.com/photos/2347329/pexels-photo-2347329.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    spotId: 3,
    url: "https://images.stockcake.com/public/5/e/2/5e246ae1-6c2b-4947-822d-e566017cd127_large/enchanted-waterfall-castle-stockcake.jpg",
  },
  {
    spotId: 4,
    url: "https://images.pexels.com/photos/2129795/pexels-photo-2129795.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    spotId: 5,
    url: "https://images.pexels.com/photos/3985184/pexels-photo-3985184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    spotId: 6,
    url: "https://images.stockcake.com/public/b/1/e/b1e46e39-2386-417e-8250-92624b56bfc0_large/gothic-castle-twilight-stockcake.jpg",
  },
  {
    spotId: 7,
    url: "https://images.stockcake.com/public/4/1/7/417719e3-f915-4ee2-8ee4-63d81093fb39_large/misty-castle-aerial-stockcake.jpg",
  },
  {
    spotId: 8,
    url: "https://images.pexels.com/photos/2246475/pexels-photo-2246475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    spotId: 9,
    url: "https://images.pexels.com/photos/2294476/pexels-photo-2294476.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    spotId: 10,
    url: "https://images.stockcake.com/public/1/7/8/178cad0b-dc88-4f7f-aefa-269495728873_large/magnificent-medieval-castle-stockcake.jpg",
  },
];

//above i modified the image seeder for spot Id 10, it used to be 1

/** @type {import('sequelize-cli').Migration} */
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
    await SpotImage.bulkCreate(seedArray, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
