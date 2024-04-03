const express = require("express");
const router = express.Router();
const { Spot, Session, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.use((req, res, next) => {
  console.log("this is the top of the spots router");
  next();
});
/***************** *   ALL SPOTS BY OWNER   *************************/

router.put("/", requireAuth, (req, res, next) => {});

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
