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
const { check, query, validationResult } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");

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

const spotValidator = (req, res, next) => {
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (
    !address ||
    !city ||
    !state ||
    !country ||
    !lat ||
    !lng ||
    !name ||
    !description ||
    !price ||
    price < 0 ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude must be within -90 and 90",
        lng: "Longitude must be within -180 and 180",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day must be a positive number",
      },
    });
  }
  next();
};

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
    const err = new Error("Spot couldnt be found");
    err.status = 404;
    return next(err);
  }
  if (reviews.length === 0) [res.json("no reviews yet! :)")];

  res.json(reviews);
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
      console.log(ele, "ELE<<<<<<<<<<<<<<<<<");
      const newObj = {};
      newObj.spotId = ele.spotId;
      newObj.startDate = ele.startDate;
      newObj.endDate = ele.endDate;
      answerArray.push(newObj);
    });

    res.json(answerArray);
  }
});

/* ************************************** CREATE A BOOKING BY SPOT ID ********************************** */

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;

  let startDateTime = new Date(startDate);
  let endDateTime = new Date(endDate);
  startDateTime = startDateTime.getTime();
  endDateTime = endDateTime.getTime();

  if (startDateTime >= endDateTime) {
    const err = new Error("endDate cannot be on or before startDate");
    err.status = 400;
    return next(err);
  }

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldnt be found");
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
  });

  const newBooking = await Booking.create({
    startDate,
    endDate,
    spotId: req.params.spotId,
    userId: req.user.id,
  });

  res.json(newBooking);
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

router.get(
  "/",
  queryValidate,
  handleValidationErrors,
  async (req, res, next) => {
    let { page, size, minLat, minLng, maxLat, maxLng, minPrice, Maxprice } =
      req.query;

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
    return next(err);
  }

  req.body.spotId = currUser;
  const newIMage = await SpotImage.create(req.body);
  console.log(newIMage.toJSON());

  res.json(newIMage);
});

/***************** *    CREATE A NEW SPOT    *************************/

router.post(
  "/",
  requireAuth,
  spotValidator,
  handleValidationErrors,
  async (req, res, next) => {
    console.log("req.body", req.body);
    console.log(
      "req.user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      req.user.toJSON().id
    );
    req.body.ownerId = req.user.toJSON().id;
    const newSpot = await Spot.create(req.body);
    res.status = 201;
    res.json(newSpot);
  }
);

module.exports = router;
