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

/*******************************************  DELETE A REVIEW    ************************************************** */

router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const currUser = req.user.id;

  const foundReview = await Review.findByPk(reviewId);

  if (!foundReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (foundReview.userId !== currUser) {
    const err = new Error("cannot delete a review you didnt make");
    err.status = 403;
    return next(err);
  }

  await foundReview.destroy();

  res.json({ message: "Successfully deleted" });
});

/*******************************************  EDIT A REVIEW     ************************************************** */

router.put("/:reviewID", requireAuth, async (req, res, next) => {
  const foundReview = await Review.findByPk(req.params.reviewID);

  const { review, stars } = req.body;

  if (!foundReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (foundReview.userId !== req.user.id) {
    console.log(review.userId, "USER ID", req.user.id);
    const err = new Error("cannot edit a review you didnt make");
    err.status = 404;
    return next(err);
  }

  foundReview.review = review;
  foundReview.stars = stars;

  foundReview.save();

  res.json(foundReview);
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

/*******************************************  ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID ************************************************** */

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const currUser = req.user.id;
  const reviewId = req.params.reviewId;
  const { url } = req.body;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (review.userId !== currUser) {
    const err = new Error("can only edit your own reviews");
    err.status = 403;
    return next(err);
  }
  let newReview;
  if (url) {
    newReview = await ReviewImage.create({ url, reviewId });
    // console.log(newReview);
    // console.log("this is the add image review ID");
  }

  res.json(newReview);
});

module.exports = router;
