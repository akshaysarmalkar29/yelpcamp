const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model("Campground", campgroundSchema);