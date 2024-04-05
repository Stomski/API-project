const express = require("express");
const router = express.Router();
const {
  Spot,
  Session,
  SpotImage,
  Review,
  ReviewImage,
  User,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.use((req, res, next) => {
  console.log(
    "**************************this is the top of the REVIEW IMAGES router*******************************"
  );
  next();
});

/***************** *   DELETE A REVIEW IMAGE   *************************/

router.delete("/:imageId", requireAuth);

module.exports = router;
