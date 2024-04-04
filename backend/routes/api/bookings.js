const express = require("express");
const router = express.Router();
const {
  Spot,
  Session,
  SpotImage,
  Review,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.use((req, res, next) => {
  console.log(
    "**************************************TOP OF BOOKINGS ROUTER ********************************** for real though "
  );
  next();
});

module.exports = router;
