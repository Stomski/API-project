// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const spotImagesRouter = require("./spotImages.js");
const reviewImagesRouter = require("./reviewImages.js");

const { restoreUser, requireAuth } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use(restoreUser);

router.get("/test", requireAuth, (req, res) => {
  res.json({ message: "success" });
});

router.use("/bookings", bookingsRouter);

router.use("/session", sessionRouter);
router.use("/review-images", reviewImagesRouter);

router.use("/reviews", reviewsRouter);
router.use("/spot-images", spotImagesRouter);

router.use("/users", usersRouter);
router.use("/spots", spotsRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
