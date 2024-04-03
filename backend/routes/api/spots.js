const express = require("express");
const router = express.Router();
const { Spot } = require("../../db/models");

router.get("/", async (req, res, next) => {
  console.log("crushing it", Spot, ",,,,,,,,,,, spot <<<<<<<<<<");

  const spots = await Spot.findAll({
    include: ["SpotImages", "Reviews"],
  });

  res.json(spots);
});

module.exports = router;
