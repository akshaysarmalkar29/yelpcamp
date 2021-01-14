const Campground = require("../models/campground");
const Review = require("../models/review");
const {campgroundSchema, reviewSchema} = require("../schemas");
const {ExpressError} = require("../utils/expressError");

module.exports = {
    validateCampground: (req, res, next) => {
        const {error} = campgroundSchema.validate(req.body);
        if(error) {
            next(new ExpressError(error.details[0].message, 400));
        } else {
            next();
        }
    },
    validateReview: (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error) {
            next(new ExpressError(error.details[0].message, 400));
        } else {
            next();
        }
    },
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.session.returnTo = req.orignalUrl;
        req.flash("error", "Please login first");
        res.redirect("/login");
    },
    isCampgroundOwner: async (req, res, next) => {
        const {id} = req.params;
        const camp = await Campground.findById(id);
        if(camp.author.equals(req.user._id)) {
            return next();
        }
        req.flash("error", "You don't have the permission to do that");
        res.redirect("/campgrounds");
    },
    isReviewOwner: async (req, res, next) => {
        const {reviewId} = req.params;
        const  review= await Review.findById(reviewId);
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.flash("error", "You don't have the permission to do that");
        res.redirect("/campgrounds");
    }
}