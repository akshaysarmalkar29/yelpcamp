const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateCampground, isCampgroundOwner} = require("../middlewares");
const {storage, cloudinary} = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage});

router.get("/", catchAsync(async function(req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds, pageTitle: "All Campgrounds"});
}));

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {pageTitle: "New Campground"});
    console.log(req.user);
});

router.post("/", isLoggedIn , upload.array("images", 4) , validateCampground, catchAsync(async function(req, res) {
    const camp = await Campground.create({...req.body.campground});
    camp.images = req.files.map(el => ({url: el.path, filename: el.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
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