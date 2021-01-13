const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: Number,
    text: String
});

module.exports = mongoose.model("Review", reviewSchema);