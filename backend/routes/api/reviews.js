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
    "**************************************TOP OF REVIEW ROUTER ********************************** for real though "
  );
  next();
});

/*******************************************  GET ALL REVIEWS BY CURRENT USER   ************************************************** */

router.get("/current", requireAuth, async (req, res, next) => {
  console.log("making progress");
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [ReviewImage, Spot],
  });

  res.json(reviews);
});

module.exports = router;
