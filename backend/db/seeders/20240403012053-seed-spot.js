"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedArray = [
  {
    ownerId: 1,
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    lat: 40.7128,
    lng: -74.006,
    name: "Cozy Apartment",
    description: "A comfortable apartment in the heart of the city",
    price: 1500,
  },
  {
    ownerId: 1,
    address: "456 Elm St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lng: -118.2437,
    name: "Sunny Beach House",
    description: "A beautiful beach house with ocean view",
    price: 2000,
  },
  {
    ownerId: 1,
    address: "789 Oak St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    lat: 41.8781,
    lng: -87.6298,
    name: "Urban Loft",
    description: "A modern loft in downtown Chicago",
    price: 1800,
  },
  {
    ownerId: 1,
    address: "101 Pine St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    lat: 37.7749,
    lng: -122.4194,
    name: "Luxury Condo",
    description: "An elegant condo with stunning city views",
    price: 3000,
  },
  {
    ownerId: 1,
    address: "202 Maple St",
    city: "Miami",
    state: "FL",
    country: "USA",
    lat: 25.7617,
    lng: -80.1918,
    name: "Tropical Villa",
    description: "A luxurious villa surrounded by palm trees",
    price: 2500,
  },
  {
    ownerId: 2,
    address: "303 Walnut St",
    city: "Austin",
    state: "TX",
    country: "USA",
    lat: 30.2672,
    lng: -97.7431,
    name: "Downtown Loft",
    description: "A stylish loft in the heart of Austin",
    price: 1600,
  },
  {
    ownerId: 2,
    address: "404 Cedar St",
    city: "Seattle",
    state: "WA",
    country: "USA",
    lat: 47.6062,
    lng: -122.3321,
    name: "Modern Apartment",
    description: "An apartment with contemporary design",
    price: 1700,
  },
  {
    ownerId: 2,
    address: "505 Birch St",
    city: "Portland",
    state: "OR",
    country: "USA",
    lat: 45.5051,
    lng: -122.675,
    name: "Charming Cottage",
    description: "A cozy cottage surrounded by nature",
    price: 1400,
  },
  {
    ownerId: 2,
    address: "606 Ash St",
    city: "Denver",
    state: "CO",
    country: "USA",
    lat: 39.7392,
    lng: -104.9903,
    name: "Mountain Retreat",
    description: "A tranquil retreat in the Rocky Mountains",
    price: 2200,
  },
  {
    ownerId: 2,
    address: "707 Pine St",
    city: "Nashville",
    state: "TN",
    country: "USA",
    lat: 36.1627,
    lng: -86.7816,
    name: "Music City Loft",
    description: "A loft in the heart of Nashville's music scene",
    price: 1900,
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
    await Spot.bulkCreate(seedArray, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";

    return queryInterface.bulkDelete(options, null, {});
  },
};
