const express = require("express");
const router = express.Router();
const {
  Spot,
  Session,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const {
  bookingValidators,
  dateFormatting,
  bookingDayFormat,
  spotValidator,
} = require("../../utils/functionality");

// router.use((req, res, next) => {
//   // console.log(
//   //   "**************************************TOP OF BOOKINGS ROUTER ********************************** for real though "
//   // );
//   next();
// });

/* ************************************** DELETE A BOOKING  ********************************** */

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    const err = new Error("Booking couldnt be found");
    err.title = "validation Error";
    err.status = 404;
    return next(err);
  }

  if (booking.userId !== req.user.id) {
    const err = new Error("cannot edit booking that isnt yours");
    err.status = 403;
    return next(err);
  }

  booking.destroy();

  res.json("succesfully deleted");
});

/* ************************************** EDIT A BOOKING  ********************************** */

router.put(
  "/:bookingId",
  requireAuth,
  bookingValidators,
  async (req, res, next) => {
    const currUser = req.user.id;
    const booking = await Booking.findByPk(req.params.bookingId);

    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      const err = new Error("endDate and startdate required");
      err.status = 400;
      return next(err);
    }

    if (!booking) {
      const err = new Error("Booking couldnt be found");
      err.status = 404;
      return next(err);
    }
    if (booking.userId !== currUser) {
      const err = new Error(
        " cannot edit this booking, improper authorizations"
      );
      err.status = 403;
      return next(err);
    }

    // console.log("booking!!!!!!!!!!!!!!!!!!!!!!!", booking.spotId);

    const allSpotBookings = await Booking.findAll({
      where: { spotId: booking.spotId },
    });

    console.log(
      allSpotBookings,
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< all spot bookings"
    );
    let startDateTime = new Date(startDate);
    let endDateTime = new Date(endDate);
    startDateTime = startDateTime.getTime();
    endDateTime = endDateTime.getTime();

    let nowTime = new Date();
    nowTime = nowTime.getTime();

    if (startDateTime >= endDateTime) {
      const err = new Error("endDate cannot be on or before startDate");
      err.status = 400;
      return next(err);
    }

    allSpotBookings.forEach((ele) => {
      ele = ele.toJSON();
      ele.startDate = ele.startDate.getTime();
      ele.endDate = ele.endDate.getTime();

      console.log("ele.id", ele.id);
      console.log(parseInt(req.params.bookingId), "PARAMS");

      if (ele.id !== parseInt(req.params.bookingId)) {
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
        if (startDateTime < ele.startDate && endDateTime > ele.endDate) {
          const err = new Error(
            "Sorry, this spot is already booked for the specified dates"
          );
          err.error = {
            startDate: "Booking dates surround existing booking",
            endDate: "Booking dates surround existing booking",
          };
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
      } else {
        console.log(
          "this is hit when the booking is comparing itself to itself"
        );
      }
    });

    booking.startDate = new Date(startDate);
    booking.endDate = new Date(endDate);
    booking.save();
    let returnObj = booking.toJSON();
    returnObj.startDate = bookingDayFormat(returnObj.startDate);
    returnObj.endDate = bookingDayFormat(returnObj.endDate);
    returnObj.createdAt = dateFormatting(returnObj.createdAt);
    returnObj.updatedAt = dateFormatting(returnObj.updatedAt);
    res.json(returnObj);
  }
);

/* ************************************** GET ALL CURRENT USER BOOKINGS ********************************** */
router.get("/current", requireAuth, async (req, res, next) => {
  const currUser = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId: currUser },
    include: [Spot],
  });

  if (!bookings) {
    const err = new Error("no bookings could be found");
    err.status = 404;
    return next(err);
  }
  let answerArray = [];
  for (let ele of bookings) {
    ele = ele.toJSON();
    // console.log("ele", ele, "ELE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);
    ele.startDate = bookingDayFormat(ele.startDate);
    ele.endDate = bookingDayFormat(ele.endDate);
    let spotfound = await Spot.findByPk(ele.Spot.id, {
      include: [SpotImage],
    });
    // console.log("spot found", spotfound);
    spotfound = spotfound.toJSON();
    if (spotfound.SpotImages.length) {
      ele.previewImage = spotfound.SpotImages[0].url;
    } else {
      ele.previewImage = null;
    }
    delete ele.Spot.createdAt;
    delete ele.Spot.updatedAt;
    answerArray.push(ele);
  }

  res.json(answerArray);
});

module.exports = router;
