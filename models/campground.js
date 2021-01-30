const mongoose = require("mongoose");
const Review = require("./review");
const {cloudinary} = require("../cloudinary");

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post('findOneAndRemove', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
        for(let img of doc.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);