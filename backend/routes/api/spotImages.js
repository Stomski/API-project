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

  if (!image) {
    const err = new Error("Image couldnt be found");
    err.status = 404;
    return next(err);
  }

  if (req.user.id !== image.userId) {
    const err = new Error("cant edit spot you dont own");
    err.title = "Not Authorized";
    err.status = 403;
    return next(err);
  }

  image.destroy();

  res.json("Succesfully deleted");
});

module.exports = router;
