const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports = {
    createReview: async function(req, res, next) {
        const {id} = req.params;
        const review = await Review.create(req.body.review);
        review.author = req.user;
        await review.save();
        const camp = await Campground.findById(id);
        camp.reviews.push(review);
        await camp.save();
        req.flash("success", "Review Created Successfully");
        res.redirect(`/campgrounds/${id}`);
    },
    deleteReview: async function (req, res) {
        const {id, reviewId} = req.params;
        await Campground.findByIdAndUpdate(id, {
            $pull: {
                reviews: reviewId
            }
        });
        await Review.findByIdAndRemove(reviewId);
        req.flash("success", "Review Deleted Successfully");
        res.redirect(`/campgrounds/${id}`);
    }
}