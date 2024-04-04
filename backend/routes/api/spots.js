const express = require("express");
const router = express.Router();
const {
  Spot,
  Session,
  SpotImage,
  Review,
  ReviewImage,
  User,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const e = require("express");

router.use((req, res, next) => {
  console.log(
    "**************************this is the top of the spots router*******************************"
  );
  next();
});

/***************** *   DELETE A SPOT *************************/

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  console.log("spot", spot);
  if (!spot) {
    return next(new Error("spot couldnt be found"));
  }
  if (spot.ownerId !== req.user.id) {
    const err = new Error("cannot delete spot you dont own");
    return next(err);
  }

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

/***************** *   EDIT SPOT  *************************/

router.put("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (spot.ownerId !== req.user.id) {
    const err = new Error("cant edit spot you dont own");
    return next(err);
  }

  // console.log(spot.ownerId, "OWNER ID");
  // console.log(spot.toJSON());
  console.log("********** REQ BODY ****************", req.body);
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (address) spot.address = address;
  if (city) spot.city = city;
  if (state) spot.state = state;
  if (country) spot.country = country;
  if (lat) spot.lat = lat;
  if (lng) spot.lng = lng;
  if (name) spot.name = name;
  if (description) spot.description = description;
  if (price) spot.price = price;
  let apple = await spot.save();
  apple = apple.toJSON();
  delete spot.previewImage;

  res.json(spot);
});

/*******************************************  GET ALL REVIEWS BY SPOT  ************************************************** */

router.get("/:spotId/reviews", async (req, res, next) => {
  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [ReviewImage, User],
  });

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return next(new Error("Spot Not Found"));
  }
  if (reviews.length === 0) [res.json("no reviews yet! :)")];

  res.json(reviews);
});

/***************** *   ALL SPOTS BY OWNER   *************************/

router.get("/current", requireAuth, async (req, res, next) => {
  const currUser = req.user.toJSON().id;

  const currSpots = await Spot.findAll({
    where: {
      ownerId: currUser,
    },
    include: ["SpotImages", "Reviews"],
  });

  if (currSpots === null) {
    const err = new Error("no spots owned by current user");
    return next(err);
  }

  console.log(currSpots, "<<<<<<<<<<<<<<<<<<<< CURR SPOTS");

  let spotArray = [];

  //find and set previewImage

  currSpots.forEach((ele) => {
    ele = ele.toJSON();
    // console.log(ele, "<<<<<<<<<<<<<<< ele");
    // console.log(ele.SpotImages, "<<<<<<ELE > SPOT IMAGES");
    //avg review
    console.log(
      "IM SEARCHING !!!!!!!!!!!!!!!!!!!!!!!!!!!!>>>>>>>> ",
      ele.previewImage
    );
    if (ele.Reviews.length) {
      // console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
      let sum = 0;
      ele.Reviews.forEach((ele) => {
        console.log(ele.stars);
        sum += ele.stars;
      });

      ele.avgRating = sum / ele.Reviews.length;
    }

    if (ele.previewImage === null) {
      if (ele.SpotImages.length) {
        ele.previewImage = ele.SpotImages[0].url;
      } else {
        ele.previewImage = null;
      }
    } else {
      ele.previewImage = ele.previewImage.toJSON().url;
    }

    delete ele.SpotImages;
    delete ele.Reviews;

    spotArray.push(ele);
  });

  // console.log(">>>>>>>>>>>>>>>> THIS IS WHAT IM RETURNING", spotArray, "<<<<<<<<<<<<<< RETURNING THIS");

  res.json(spotArray);
});

/***************** *   Create a Review for a Spot based on the Spot's id   *************************/

router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  console.log("crushing");

  const spot = await Spot.findByPk(req.params.spotId);

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id,
    },
  });

  if (reviews.length) {
    const err = new Error("cannot review same spot twice");
    err.status = 500;

    return next(err);
  }

  if (!spot) {
    const err = new Error("Spot couldnt be found");
    err.status = 404;
    return next(err);
  }

  const { review, stars } = req.body;
  const reviewstuff = { review, stars };
  reviewstuff.spotId = req.params.spotId;
  reviewstuff.userId = req.user.id;
  const newReview = await Review.create({ ...reviewstuff });
  res.json(newReview);
});

/***************** *    SPOT DETAILS BY ID    *************************/

router.get("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  console.log("top of get spotId. params >>>>", spotId);

  let spot = await Spot.findByPk(spotId, {
    include: ["SpotImages", "Reviews", "User"],
  });

  if (spot === null) {
    console.log("spot not foiund by id");
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  console.log(
    ">>>>>>>>>>>>>>>>>>>>>>>>>>>",
    spot.Reviews,
    "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
  );
  spot = spot.toJSON();
  if (spot.Reviews.length) {
    console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
    let sum = 0;
    spot.Reviews.forEach((ele) => {
      console.log(ele, "ele");
      sum += ele.stars;
    });
    spot.numReviews = spot.Reviews.length;
    spot.avgRating = sum / spot.Reviews.length;
    delete spot.Reviews;
  }

  spot.Owner = spot.User;
  delete spot.User;

  res.json(spot);
});

/***************** *    GET ALL SPOTS    *************************/

router.get("/", async (req, res, next) => {
  console.log("this is hit");
  const spots = await Spot.findAll({
    include: ["SpotImages", "Reviews"],
  });
  let spotArray = [];

  if (spots !== null) {
    spots.forEach((ele) => {
      ele = ele.toJSON();

      //avg review

      if (ele.Reviews.length) {
        console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
        let sum = 0;
        ele.Reviews.forEach((ele) => {
          console.log(ele.stars);
          sum += ele.stars;
        });

        ele.avgRating = sum / ele.Reviews.length;
        delete ele.Reviews;
      }

      //find and set previewImage

      if (ele.SpotImages.length) {
        ele.previewImage = ele.SpotImages[0].url;
        delete ele.SpotImages;
      } else {
        ele.previewImage = null;
      }
      spotArray.push(ele);
    });
  }
  res.json({ Spots: spotArray });
});

/***************** *    ADD IMAGE TO SPOT    *************************/

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const currUser = req.user.toJSON().id;
  // console.log(req.body, "req.body*(******************");

  const spot = await Spot.findByPk(req.params.spotId);

  // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", spot.ownerId);

  if (spot === null) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== currUser) {
    const err = new Error("can only add pictures to spots you own");
    return next(err);
  }

  req.body.spotId = currUser;
  const newIMage = await SpotImage.create(req.body);
  console.log(newIMage.toJSON());

  res.json(newIMage);
});

/***************** *    CREATE A NEW SPOT    *************************/

router.post("/", requireAuth, async (req, res, next) => {
  console.log("req.body", req.body);
  console.log(
    "req.user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    req.user.toJSON().id
  );
  req.body.ownerId = req.user.toJSON().id;
  const newSpot = await Spot.create(req.body);
  res.status = 201;
  res.json(newSpot);
});

module.exports = router;
