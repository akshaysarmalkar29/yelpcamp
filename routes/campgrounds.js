const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateCampground, isCampgroundOwner} = require("../middlewares");
const {storage, cloudinary} = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage});
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

router.get("/", catchAsync(async function(req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds, pageTitle: "All Campgrounds"});
}));

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {pageTitle: "New Campground"});
});

router.post("/", isLoggedIn , upload.array("images", 4) , validateCampground, catchAsync(async function(req, res) {
    const response = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    console.log(response.body.features[0].geometry);
    const campground = new Campground(req.body.campground);
    campground.geometry = response.body.features[0].geometry;
    // const camp = await Campground.create({...req.body.campground});
    campground.images = req.files.map(el => ({url: el.path, filename: el.filename}));
    campground.author = req.user._id;
    campground.geometry = response.body.features[0].geometry;
    console.log(campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
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
    console.log(campground);
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

router.put("/:id", isLoggedIn, isCampgroundOwner, upload.array("images", 4), validateCampground, catchAsync(async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    if(req.body.deleteImages) {
        for(let val of req.body.deleteImages) {
            await cloudinary.uploader.destroy(val);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/campgrounds/${id}`);
}))

router.delete("/:id", isLoggedIn, isCampgroundOwner, catchAsync(async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect(`/campgrounds`);
}))

module.exports = router;