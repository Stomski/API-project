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
    "*************************  this is the top of the SPOT IMAGES router  *******************************"
  );
  next();
});

/***************** *   DELETE A SPOT IMAGE   *************************/

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await SpotImage.findByPk(req.params.imageId);

  image.destroy();

  res.json("SLAY THE DRAGON");
});

module.exports = router;
