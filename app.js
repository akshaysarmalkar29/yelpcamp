const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get("/", function(req, res) {
    res.send("Home Page");
});

app.get("/campgrounds", async function(req, res) {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async function(req, res) {
    const camp = await Campground.create({...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`);
});

app.get("/campgrounds/:id", async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", {campground});
})

app.get("/campgrounds/:id/edit", async function(req, res) {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground});
})

app.put("/campgrounds/:id", async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
})

app.delete("/campgrounds/:id", async function(req, res) {
    const {id} = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect(`/campgrounds`);
})

app.listen(3000, () => {
    console.log("Server running on Port 3000");
})