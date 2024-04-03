// const bcrypt = require("bcrypt");
console.log("helklo world");

// Hashed password
const hashedPassword = "password";

// Famous people's information
const famousPeople = [
  { firstName: "Pablo", lastName: "Picasso" },
  { firstName: "Marie", lastName: "Curie" },
  { firstName: "Leonardo", lastName: "da Vinci" },
  { firstName: "Albert", lastName: "Einstein" },
  { firstName: "Vincent", lastName: "van Gogh" },
  { firstName: "Ada", lastName: "Lovelace" },
  { firstName: "Isaac", lastName: "Newton" },
  { firstName: "Rosa", lastName: "Parks" },
  { firstName: "Martin", lastName: "Luther King" },
  { firstName: "Amelia", lastName: "Earhart" },
];

// Array to hold generated users
const users = [];

// Generating 10 user objects
for (let i = 0; i < 10; i++) {
  const { firstName, lastName } = famousPeople[i];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const username = `${firstName
    .charAt(0)
    .toUpperCase()}${lastName.toLowerCase()}`;

  users.push({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });
}

console.log(users);
