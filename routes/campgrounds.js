const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateCampground, isCampgroundOwner} = require("../middlewares");


router.get("/", catchAsync(async function(req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds, pageTitle: "All Campgrounds"});
}));

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {pageTitle: "New Campground"});
});

router.post("/", isLoggedIn , validateCampground, catchAsync(async function(req, res) {
    const camp = await Campground.create({...req.body.campground});
    camp.author = req.user;
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.get("/:id", catchAsync(async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
            model: "User"
        }
    }).populate("author").exec();
    if(!campground) {
        req.flash("error", "Campground Unavailable");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground, pageTitle: `${campground.title}'s Campground`});
}))

router.get("/:id/edit", isLoggedIn, isCampgroundOwner ,catchAsync(async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Campground Unavailable");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground, pageTitle: "Edit Campground"});
}))

router.put("/:id", isLoggedIn, isCampgroundOwner, validateCampground, catchAsync(async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
}))

router.delete("/:id", isLoggedIn, isCampgroundOwner, catchAsync(async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect(`/campgrounds`);
}))

module.exports = router;