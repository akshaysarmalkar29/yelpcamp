const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const {reviewSchema} = require("../schemas");
const ExpressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        next(new ExpressError(error.details[0].message, 400));
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async function(req, res,) {
    const {id} = req.params;
    const review = await Review.create(req.body.review);
    const camp = await Campground.findById(id);
    camp.reviews.push(review);
    await camp.save();
    req.flash("success", "Review Created Successfully");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:reviewId", catchAsync(async function (req, res) {
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