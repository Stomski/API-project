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
  // console.log(
  //   "**************************this is the top of the REVIEW IMAGES router*******************************"
  // );
  next();
});

/***************** *   DELETE A REVIEW IMAGE   *************************/

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: [Review],
  });
  // console.log("MIMAGEEEEEEEE", image.toJSON());

  // console.log("parseInt(req.user.id)", parseInt(req.user.id));
  // console.log("parseInt(image.userId)", parseInt(image.userId));

  if (!image) {
    const err = new Error("Image couldnt be found");
    err.title = "Couldn't find a Review Image with the specified id";
    err.status = 404;
    return next(err);
  }

  if (parseInt(req.user.id) !== parseInt(image.Review.userId)) {
    const err = new Error("cant edit spot you dont own");
    err.status = 403;
    err.title = "request Error";
    return next(err);
  }

  image.destroy();

  res.json("Succesfully deleted");
});

module.exports = router;
