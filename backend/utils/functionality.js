const { check, query, validationResult } = require("express-validator");

const dateFormatting = (date) => {
  // console.log(date);
  const newDate = new Date(date);
  // console.log("newdate>>>>>>>>.", newDate);
  // console.log(newDate.getMonth() + 1);
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  const day = newDate.getDate();
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/*
when using above,

    ele.createdAt = dateFormatting(ele.createdAt);
    ele.updatedAt = dateFormatting(ele.updatedAt);

*/

const bookingDayFormat = (date) => {
  // console.log(date);
  const newDate = new Date(date);
  // console.log("newdate>>>>>>>>.", newDate);
  // console.log(newDate.getMonth() + 1);
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  const day = newDate.getDate();

  return `${year}-${month}-${day}`;
};

/*
when using above,

  newBooking.startDate = bookingDayFormat(newBooking.startDate);
  newBooking.endDate = bookingDayFormat(newBooking.endDate);

*/

const bookingValidators = (req, res, next) => {
  // let errors = validationResult(req);
  // if (errors.length > 0) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  let { startDate, endDate } = req.body;

  if (!endDate || !startDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date required" });
  }

  if (new Date(startDate) <= new Date()) {
    return res.status(400).json({ message: "Dates cannot be in the past" });
  }

  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ message: "Invalid date" });
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return res
      .status(400)
      .json({ message: "End date must be after start date" });
  }
  next();
};

const spotValidator = (req, res, next) => {
  console.log("spotValidator valled req body", req.body);
  let { address, city, country, state, lat, lng, name, description, price } =
    req.body;

  if (
    !address ||
    !city ||
    !state ||
    !country ||
    // !lat
    // !lng ||
    !name ||
    !description ||
    !price ||
    price < 0 ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    console.log("validations failed");
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

module.exports = {
  spotValidator,
  bookingValidators,
  dateFormatting,
  bookingDayFormat,
};
