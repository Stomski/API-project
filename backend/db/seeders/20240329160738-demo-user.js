"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedArray = [
  {
    email: "ameliaearhart@example.com",
    username: "Aearhart",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Amelia",
    lastName: "Earhart",
  },
  {
    email: "mariecurie@example.com",
    username: "Mcurie",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Marie",
    lastName: "Curie",
  },
  {
    email: "pablopicasso@example.com",
    username: "Ppicasso",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Pablo",
    lastName: "Picasso",
  },
  {
    email: "leonardodavinci@example.com",
    username: "Ldavinci",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Leonardo",
    lastName: "da Vinci",
  },
  {
    email: "alberteinstein@example.com",
    username: "Aeinstein",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Albert",
    lastName: "Einstein",
  },
  {
    email: "vincentvangogh@example.com",
    username: "Vvangogh",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Vincent",
    lastName: "van Gogh",
  },
  {
    email: "adalovelace@example.com",
    username: "Alovelace",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Ada",
    lastName: "Lovelace",
  },
  {
    email: "isaacnewton@example.com",
    username: "Inewton",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Isaac",
    lastName: "Newton",
  },
  {
    email: "rosaparks@example.com",
    username: "Rparks",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Rosa",
    lastName: "Parks",
  },
  {
    email: "martinlutherking@example.com",
    username: "Mlutherking",
    hashedPassword: bcrypt.hashSync("password"),
    firstName: "Martin",
    lastName: "Luther King",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("start of the up");
    await User.bulkCreate(seedArray, { validate: true });
    console.log("end of the up");
  },

  async down(queryInterface, Sequelize) {
    console.log("this is a test");
    options.tableName = "Users";
    console.log(options, "options <<<<<<<");
    return queryInterface.bulkDelete(options, null, {});
  },
};
