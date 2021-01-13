const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const {campgroundSchema} = require("../schemas");
const ExpressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        next(new ExpressError(error.details[0].message, 400));
    } else {
        next();
    }
}

router.get("/", catchAsync(async function(req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds, pageTitle: "All Campgrounds"});
}));

router.get("/new", function(req, res) {
    res.render("campgrounds/new", {pageTitle: "New Campground"});
});

router.post("/", validateCampground, catchAsync(async function(req, res) {
    const camp = await Campground.create({...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.get("/:id", catchAsync(async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate("reviews").exec();
    if(!campground) {
        req.flash("error", "Campground Unavailable");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground, pageTitle: `${campground.title}'s Campground`});
}))

router.get("/:id/edit", catchAsync(async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Campground Unavailable");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground, pageTitle: "Edit Campground"});
}))

router.put("/:id", validateCampground, catchAsync(async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
}))

router.delete("/:id", catchAsync(async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect(`/campgrounds`);
}))

module.exports = router;