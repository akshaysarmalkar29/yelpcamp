const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateReview, isReviewOwner} = require("../middlewares");


router.post("/", isLoggedIn ,validateReview, catchAsync(async function(req, res,) {
    const {id} = req.params;
    const review = await Review.create(req.body.review);
    review.author = req.user;
    await review.save();
    const camp = await Campground.findById(id);
    camp.reviews.push(review);
    await camp.save();
    req.flash("success", "Review Created Successfully");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewOwner , catchAsync(async function (req, res) {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndRemove(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;