const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateReview, isReviewOwner} = require("../middlewares");
const {createReview, deleteReview} = require("../controllers/reviews");

router.post("/", isLoggedIn ,validateReview, catchAsync(createReview));

router.delete("/:reviewId", isLoggedIn, isReviewOwner , catchAsync(deleteReview))


module.exports = router;