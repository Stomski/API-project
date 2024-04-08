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
const { dateFormatting } = require("../../utils/functionality");

const reviewValidator = (req, res, next) => {
  let { review, stars } = req.body;
  if (!review || !stars) {
    return res.status(400).json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }
  next();
};

router.use((req, res, next) => {
  console.log(
    "**************************************TOP OF REVIEW ROUTER **********************************  "
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

router.put(
  "/:reviewID",
  requireAuth,
  reviewValidator,
  async (req, res, next) => {
    let foundReview = await Review.findByPk(req.params.reviewID);

    const { review, stars } = req.body;

    if (!foundReview) {
      const err = new Error("Review couldn't be found");
      err.title = "Couldn't find a Review with the specified id";
      err.status = 404;
      return next(err);
    }

    if (foundReview.userId !== req.user.id) {
      console.log(review.userId, "USER ID", req.user.id);
      const err = new Error("cannot edit a review you didnt make");
      err.title = "Not Authorized";
      err.status = 403;
      return next(err);
    }

    foundReview.review = review;
    foundReview.stars = stars;

    foundReview.save();
    foundReview = foundReview.toJSON();

    foundReview.createdAt = dateFormatting(foundReview.createdAt);
    foundReview.updatedAt = dateFormatting(foundReview.updatedAt);

    res.json(foundReview);
  }
);

/*******************************************  GET ALL REVIEWS BY CURRENT USER   ************************************************** */

router.get("/current", requireAuth, async (req, res, next) => {
  console.log("making progress");
  const reviews = await Review.findAll({
    where: {
      userId: req.user.id,
    },
    include: [ReviewImage, Spot],
  });

  reviews.forEach((ele) => {
    ele = ele.toJSON();
    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);
  });
  const answer = { Reviews: reviews };

  res.json(answer);
});

/*******************************************  ADD AN IMAGE TO A REVIEW BASED ON REVIEW ID ************************************************** */

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const currUser = req.user.id;
  const reviewId = req.params.reviewId;
  const { url } = req.body;

  const review = await Review.findByPk(reviewId, {
    include: [ReviewImage],
  });

  if (!review) {
    const err = new Error("Review couldn't be found");
    err.title = "resource not found";
    err.status = 404;
    return next(err);
  }
  console.log(review);

  // if (review.userId !== currUser) {
  //   const err = new Error("can only edit your own reviews");
  //   err.status = 403;
  //   return next(err);
  // }
  const reviewJSON = review.toJSON();

  if (reviewJSON.ReviewImages.length >= 10) {
    const err = new Error(
      "Maximum number of images for this resource was reached"
    );
    err.title = "Max num images exceeded";
    err.status = 403;
    return next(err);
  }

  // console.log(spot);

  let newReview;

  newReview = await ReviewImage.create({ url, reviewId });
  newReview = newReview.toJSON();
  newReview.createdAt = dateFormatting(newReview.createdAt);
  newReview.updatedAt = dateFormatting(newReview.updatedAt);

  res.json(newReview);
});

module.exports = router;
