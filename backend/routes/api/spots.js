const express = require("express");
const router = express.Router();
const { Op, sequelize } = require("sequelize");
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
const { check, query, validationResult } = require("express-validator");
const {
  bookingValidators,
  dateFormatting,
  bookingDayFormat,
  spotValidator,
} = require("../../utils/functionality");
const { handleValidationErrors } = require("../../utils/validation");

const reviewValidator = (req, res, next) => {
  let { review, stars } = req.body;
  if (!review || !stars) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }
  next();
};

// router.use((req, res, next) => {
//   console.log(
//     "**************************this is the top of the spots router*******************************"
//   );
//   next();
// });

/***************** *   DELETE A SPOT *************************/

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  // console.log("spot", spot);
  if (!spot) {
    const err = new Error("Spot couldnt be found");
    err.status = 404;
    return next(err);
  }
  if (spot.ownerId !== req.user.id) {
    const err = new Error("cannot delete spot you dont own");
    err.title = "not authorized";
    err.status = 403;
    return next(err);
  }

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

/***************** *   EDIT SPOT  *************************/
-router.put("/:spotId", requireAuth, spotValidator, async (req, res, next) => {
  console.log("this is the top of my edit spots backend rputeer");
  let spot = await Spot.findByPk(req.params.spotId);

  if (spot === null) {
    const err = new Error("Spot couldn't be found");
    err.title = "Invalid spot ID";
    err.status = 404;
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    const err = new Error("cant edit spot you dont own");
    err.title = "Invalid spot ID";
    err.status = 403;
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

  spot = spot.toJSON();

  spot.createdAt = dateFormatting(spot.createdAt);
  spot.updatedAt = dateFormatting(spot.updatedAt);

  res.json(spot);
});

/*******************************************  GET ALL REVIEWS BY SPOT  ************************************************** */

router.get("/:spotId/reviews", async (req, res, next) => {
  let reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [ReviewImage, User],
  });

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldnt be found");
    err.title = "Invalid SpotId";
    err.status = 404;
    return next(err);
  }
  if (reviews.length === 0) return res.json([]);
  const answerArray = [];
  reviews.forEach((ele) => {
    ele = ele.toJSON();

    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);
    if (ele.ReviewImages.length) {
      ele.ReviewImages.forEach((ele) => {
        ele.createdAt = dateFormatting(ele.createdAt);
        ele.updatedAt = dateFormatting(ele.updatedAt);
      });
    }
    answerArray.push(ele);
  });

  res.json({ Reviews: answerArray });
});

/* ************************************** GET ALL BOOKINGS BY SPOT ID ********************************** */

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const currUser = req.user.id;

  const foundBookings = await Booking.findAll({
    where: { spotId: req.params.spotId },
    include: [User],
  });
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldnt be found");
    err.title = "Invalid Id";
    err.status = 404;
    return next(err);
  }

  if (!foundBookings.length) {
    const err = new Error("no bookings found");
    err.status = 404;
    return next(err);
  }
  if (req.user.id === spot.userId) {
    res.json(foundBookings);
  } else {
    const answerArray = [];
    foundBookings.forEach((ele) => {
      ele = ele.toJSON();
      // console.log(ele, "ELE<<<<<<<<<<<<<<<<<");
      const newObj = {};
      newObj.spotId = ele.spotId;
      newObj.startDate = bookingDayFormat(ele.startDate);
      newObj.endDate = bookingDayFormat(ele.endDate);

      answerArray.push(newObj);
    });

    res.json({ Bookings: answerArray });
  }
});

/* ************************************** CREATE A BOOKING BY SPOT ID ********************************** */

router.post(
  "/:spotId/bookings",
  requireAuth,
  bookingValidators,
  async (req, res, next) => {
    const { startDate, endDate } = req.body;

    let startDateTime = new Date(startDate);
    // console.log("starrt date time before get time", startDateTime);
    let endDateTime = new Date(endDate);
    startDateTime = startDateTime.getTime();
    endDateTime = endDateTime.getTime();
    let nowTime = new Date();
    // console.log(nowTime, "NOWTIMEEEEEEE");
    nowTime = nowTime.getTime();

    if (startDateTime <= nowTime || endDateTime <= nowTime) {
      // console.log("THIS IS IN THE PAST< WE HAVE A SOLUTION FOR THIS");
      const err = new Error("Bookings cannot be in the past");
      err.title = "Body validation errors";
      err.status = 400;
      next(err);
    }

    if (startDateTime >= endDateTime) {
      const err = new Error("endDate cannot be on or before startDate");
      err.status = 400;
      return next(err);
    }

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      const err = new Error("Spot couldnt be found");
      err.title = "Invalid spot ID";
      err.status = 404;
      return next(err);
    }

    if (spot.ownerId === req.user.id) {
      const err = new Error("cannot book your own spot");
      return next(err);
    }

    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
    });

    bookings.forEach((ele) => {
      ele = ele.toJSON();
      (ele.startDate = ele.startDate.getTime()),
        (ele.endDate = ele.endDate.getTime());

      if (startDateTime >= ele.startDate && startDateTime <= ele.endDate) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.error = {
          startDate: "Start date conflicts with an existing booking",
        };
        err.status = 403;
        return next(err);
      }

      if (endDateTime >= ele.startDate && endDateTime <= ele.endDate) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.error = {
          endDate: "Start date conflicts with an existing booking",
        };
        err.status = 403;
        return next(err);
      }
      if (startDateTime < ele.startDate && endDateTime > ele.endDate) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.error = {
          startDate: "Booking dates surround existing booking",
          endDate: "Booking dates surround existing booking",
        };
        err.status = 403;
        return next(err);
      }
    });

    let newBooking = await Booking.create({
      startDate,
      endDate,
      spotId: req.params.spotId,
      userId: req.user.id,
    });

    newBooking = newBooking.toJSON();
    //handle date formatting for return
    newBooking.createdAt = dateFormatting(newBooking.createdAt);
    newBooking.updatedAt = dateFormatting(newBooking.updatedAt);
    newBooking.startDate = bookingDayFormat(newBooking.startDate);
    newBooking.endDate = bookingDayFormat(newBooking.endDate);

    // console.log("TAPPING IN TO THE BOOKINGS");

    res.json(newBooking);
  }
);

/***************** *   GET ALL SPOTS BY OWNER  /USER *************************/

router.get("/current", requireAuth, async (req, res, next) => {
  const currUser = req.user.toJSON().id;

  const currSpots = await Spot.findAll({
    where: {
      ownerId: currUser,
    },
    include: ["SpotImages", "Reviews"],
  });

  if (!currSpots.length) {
    // const err = new Error("no spots owned by current user");
    // // console.log(
    //   "searching for thhis 1d!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    // );
    return [];
  }

  // console.log(currSpots, "<<<<<<<<<<<<<<<<<<<< CURR SPOTS");

  let spotArray = [];

  //find and set previewImage

  currSpots.forEach((ele) => {
    ele = ele.toJSON();
    // console.log(ele, "<<<<<<<<<<<<<<< ele");
    // console.log(ele.SpotImages, "<<<<<<ELE > SPOT IMAGES");

    // console.log(
    //   "IM SEARCHING !!!!!!!!!!!!!!!!!!!!!!!!!!!!>>>>>>>> ",
    //   ele.createdAt
    // );
    // console.log(
    //   "dateFORMATTING>>>>>>>>>>>>>>>>>",
    //   dateFormatting(ele.createdAt)
    // );
    if (ele.Reviews.length) {
      // console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
      let sum = 0;
      ele.Reviews.forEach((ele) => {
        console.log(ele.stars);
        sum += ele.stars;
      });

      ele.avgRating = sum / ele.Reviews.length;
    }

    if (ele.SpotImages.length) {
      ele.previewImage = ele.SpotImages[0].url;
    } else {
      ele.previewImage = null;
    }
    // console.log("updated at>>>>>>>>>>", ele.updatedat);
    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);

    delete ele.SpotImages;
    delete ele.Reviews;

    spotArray.push(ele);
  });

  // console.log(">>>>>>>>>>>>>>>> THIS IS WHAT IM RETURNING", spotArray, "<<<<<<<<<<<<<< RETURNING THIS");

  res.json(spotArray);
});

/***************** *   Create a Review for a Spot based on the Spot's id   *************************/

router.post(
  "/:spotId/reviews",
  requireAuth,
  reviewValidator,
  async (req, res, next) => {
    // console.log("crushing");

    const spot = await Spot.findByPk(req.params.spotId);

    console.log("%c spot log>", "color:red; font-size: 26px", spot);

    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId,
        userId: req.user.id,
      },
    });

    if (spot.ownerId === req.user.id) {
      const err = new Error("Cannot review your own spot, sorry :(");
      err.title = "Cannot Review Your Own Spot, sorry :(";
      err.status = 500;
      return next(err);
    }
    if (reviews.length) {
      const err = new Error("User already has a review for this spot");
      err.title = "Review from the current user already exists for the Spot";
      err.status = 500;

      return next(err);
    }

    if (!spot) {
      const err = new Error("Spot couldnt be found");
      err.title = "Invalid spot ID";
      err.status = 404;
      return next(err);
    }

    const { review, stars } = req.body;
    const reviewstuff = { review, stars };
    reviewstuff.spotId = req.params.spotId;
    reviewstuff.userId = req.user.id;
    let newReview = await Review.create({ ...reviewstuff });
    newReview = newReview.toJSON();
    newReview.createdAt = dateFormatting(newReview.createdAt);
    newReview.updatedAt = dateFormatting(newReview.updatedAt);

    res.status(201).json(newReview);
  }
);

/***************** *    SPOT DETAILS BY ID    *************************/

router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  // console.log("top of get spotId. params >>>>", spotId);

  let spot = await Spot.findByPk(spotId, {
    include: ["SpotImages", "Reviews", "User"],
  });

  if (spot === null) {
    // console.log("spot not foiund by id");
    const err = new Error("Spot couldn't be found");
    err.title = "Invalid spot ID";
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
    // console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
    let sum = 0;
    spot.Reviews.forEach((ele) => {
      // console.log(ele, "ele");
      sum += ele.stars;
    });
    spot.numReviews = spot.Reviews.length;
    spot.avgRating = sum / spot.Reviews.length;
  } else {
    spot.avgRating = null;
  }

  if (spot.SpotImages.length) {
    spot.SpotImages.forEach((ele) => {
      // console.log("this is a test", ele, "test complete");
      ele.createdAt = dateFormatting(ele.createdAt);
      ele.updatedAt = dateFormatting(ele.updatedAt);
    });
  }

  spot.numReviews = spot.Reviews.length ?? 0;
  spot.Owner = spot.User;

  spot.createdAt = dateFormatting(spot.createdAt);
  spot.updatedAt = dateFormatting(spot.updatedAt);
  delete spot.User;
  delete spot.Reviews;

  res.json(spot);
});

/***************** *    GET ALL SPOTS    *************************/

const queryValidate = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  query("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  query("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  query("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
];

router.get(
  "/",
  queryValidate,
  handleValidationErrors,
  async (req, res, next) => {
    let { page, size, minLat, minLng, maxLat, maxLng, minPrice, maxPrice } =
      req.query;
    // console.log("SO QWERE LOOKINMG  GGL   FOR PARAMSSSSSS");
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (page > 10) page = 10;
    if (size > 20) size = 20;

    let paginateObj = {
      limit: size,
      offset: size * (page - 1),
    };
    let searchObj = {
      where: {},
    };

    if (minLng && maxLng) {
      searchObj.where.lng = { [Op.between]: [minLng, maxLng] };
    } else if (minLng) {
      searchObj.where.lng = { [Op.gte]: minLng };
    } else if (maxLng) {
      searchObj.where.lng = { [Op.lte]: maxLng };
    }

    if (minLat && maxLat) {
      searchObj.where.lat = { [Op.between]: [minLat, maxLat] };
    } else if (minLat) {
      searchObj.where.lat = { [Op.gte]: minLat };
    } else if (maxLat) {
      queryObj.where.lat = { [Op.lte]: maxLat };
    }

    if (minPrice && maxPrice) {
      searchObj.where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      searchObj.where.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      searchObj.where.price = { [Op.lte]: maxPrice };
    }

    const spots = await Spot.findAll({
      include: ["SpotImages", "Reviews"],
      ...paginateObj,
      ...searchObj,
    });

    let spotArray = [];

    if (spots !== null) {
      spots.forEach((ele) => {
        ele = ele.toJSON();

        //avg review

        if (ele.Reviews.length) {
          // console.log("this review array exists!!!!!!!!!!!!!!!!!!!!!");
          let sum = 0;
          ele.Reviews.forEach((ele) => {
            // console.log(ele.stars);
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
        ele.createdAt = dateFormatting(ele.createdAt);
        ele.updatedAt = dateFormatting(ele.updatedAt);

        spotArray.push(ele);
      });
    }

    res.json({ Spots: spotArray });
  }
);

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
    err.title = "Not AUTHed";
    err.status = 403;
    return next(err);
  }

  req.body.spotId = req.params.spotId;
  let newIMage = await SpotImage.create(req.body);
  // console.log(
  //   newIMage.toJSON(),
  //   "IM LOOKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  // );

  newIMage = newIMage.toJSON();

  newIMage.createdAt = dateFormatting(newIMage.createdAt);
  newIMage.updatedAt = dateFormatting(newIMage.updatedAt);
  res.json(newIMage);
});

/***************** *    CREATE A NEW SPOT    *************************/

router.post(
  "/",
  requireAuth,
  spotValidator,
  handleValidationErrors,
  async (req, res, next) => {
    console.log("this is a test");
    console.log("req.body", req.body);
    // console.log(
    //   "req.user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    //   req.user.toJSON().id
    // );
    req.body.ownerId = req.user.toJSON().id;
    let newSpot = await Spot.create(req.body);

    newSpot = newSpot.toJSON();

    newSpot.createdAt = dateFormatting(newSpot.createdAt);
    newSpot.updatedAt = dateFormatting(newSpot.updatedAt);

    res.status = 201;
    res.json(newSpot);
  }
);

module.exports = router;
