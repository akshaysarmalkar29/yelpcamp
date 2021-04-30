const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require("../cloudinary");

module.exports = {
    campsIndex: async function(req, res) {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", {campgrounds, pageTitle: "All Campgrounds"});
    },
    campsNew: function(req, res) {
        res.render("campgrounds/new", {pageTitle: "New Campground"});
    },
    campsCreate: async function(req, res) {
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
    },
    campsShow: async function(req, res) {
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
    },
    campsEdit: async function(req, res) {
        const {id} = req.params;
        const campground = await Campground.findById(id);
        if(!campground) {
            req.flash("error", "Campground Unavailable");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", {campground, pageTitle: "Edit Campground"});
    },
    campsUpdate: async function(req, res) {
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
        const response = await geocodingClient.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();
        campground.geometry = response.body.features[0].geometry;
        if(req.body.deleteImages) {
            for(let val of req.body.deleteImages) {
                await cloudinary.uploader.destroy(val);
            }
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        res.redirect(`/campgrounds/${id}`);
    },
    campsDelete: async function(req, res) {
        const {id} = req.params;
        await Campground.findByIdAndRemove(id);
        res.redirect(`/campgrounds`);
    }
};