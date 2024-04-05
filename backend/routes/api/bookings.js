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

const validateSpot = (req, res, next) => {
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
    "**************************************TOP OF BOOKINGS ROUTER ********************************** for real though "
  );
  next();
});

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

/*

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


*/

router.put("/:bookingId", requireAuth, async (req, res, next) => {
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
    const err = new Error("cannot edit this booking, improper authorizations");
    return next(err);
  }

  let startDateTime = new Date(startDate);
  let endDateTime = new Date(endDate);
  startDateTime = startDateTime.getTime();
  endDateTime = endDateTime.getTime();

  if (startDateTime >= endDateTime) {
    const err = new Error("endDate cannot be on or before startDate");
    err.status = 400;
    return next(err);
  }

  const bookingStartDate = booking.startDate.getTime();
  const bookingEndDate = booking.endDate.getTime();

  if (startDateTime >= bookingStartDate && startDateTime <= bookingEndDate) {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.error = {
      startDate: "Start date conflicts with an existing booking",
    };
    err.status = 403;
    return next(err);
  }

  if (endDateTime >= bookingStartDate && endDateTime <= bookingEndDate) {
    const err = new Error(
      "Sorry, this spot is already booked for the specified dates"
    );
    err.error = {
      endDate: "Start date conflicts with an existing booking",
    };
    err.status = 403;
    return next(err);
  }

  booking.startDate = new Date(startDate);
  booking.endDate = new Date(endDate);
  booking.save();

  res.json(booking);
});

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

  res.json(bookings);
});

module.exports = router;
