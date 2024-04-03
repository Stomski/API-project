const express = require("express");
const router = express.Router();
const { Spot, Session, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.use((req, res, next) => {
  console.log("this is the top of the spots router");
  next();
});

/***************** *   ALL SPOTS BY OWNER   *************************/
/*
get all spots by current user

Returns all the spots owned (created) by the current user.

 An authenticated user is required for a successful response
 Successful response includes only spots created by the current user
 Spot data returned includes the id, ownerId, address, city,
state, country, lat, lng, name, description, price, createdAt,
updatedAt, previewImage, and avgRating
*/

router.get("/current", requireAuth, async (req, res, next) => {
  const currUser = req.user.toJSON().id;

  const currSpots = await Spot.findAll({
    where: {
      ownerId: currUser,
    },
    include: ["SpotImages"],
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
    console.log(ele, "<<<<<<<<<<<<<<< ele");
    console.log(ele.SpotImages, "<<<<<<ELE > SPOT IMAGES");
    if (ele.SpotImages.length) {
      ele.previewImage = ele.SpotImages[0].url;
      delete ele.SpotImages;
    } else {
      ele.previewImage = null;
    }

    spotArray.push(ele);
  });

  console.log(spotArray);

  res.json(spotArray);
});

/***************** *    SPOT DETAILS BY ID    *************************/

/*
Returns the details of a spot specified by its id.

 Successful response includes data only for the specified spot
 Spot data returned includes the id, ownerId, address, city,
state, country, lat, lng, name, description, price, createdAt,
and updatedAt
 Spot data returns aggregate data for numReviews and avgStarRating
 Spot data returns associated data for SpotImages, an array of image
data including the id, url, and preview
 Spot data returns associated data for Owner, including the id,
firstName, and lastName
 Error response with status 404 is given when a spot does not exist with
the provided id
*/

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

/*  add image to spot based on spotID
Create and return a new image for a spot specified by id.

 An authenticated user is required for a successful response
 Only the owner of the spot is authorized to add an image
 New image exists in the database after request
 Image data returned includes the id, url, and preview
 Error response with status 404 is given when a spot does not exist with
the provided id
*/

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const currUser = req.user.toJSON().id;
  // console.log(req.body, "req.body*(******************");
  const spot = await Spot.findByPk(req.params.spotId);

  // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", spot.ownerId);

  if (spot === null) {
    const err = new Error("Spot couldn't be found");
    return next(err);
  }

  if (spot.ownerId !== currUser) {
    const err = new Error("can only add pictures to spots you own");
    return next(err);
  }

  req.body.spotId = currUser;
  const newIMage = await SpotImage.create(req.body);
  console.log(newIMage);

  res.json(newIMage);
});

/*
Creates and returns a new spot.

 An authenticated user is required for a successful response
 New spot exists in the database after request
 Spot data returned includes the id, ownerId, address, city,
state, country, lat, lng, name, description, price, createdAt,
and updatedAt
 Error response with status 400 is given when body validations for the
address, city, state, country, lat, lng, name, description, or price are violated
*/

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
