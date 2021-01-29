const Joi = require("joi");

module.exports = {
    campgroundSchema: Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
            description: Joi.string().required(),
            // images: Joi.string().required()
        }).required(),
        deleteImages: Joi.array()
    }),
    reviewSchema: Joi.object({
        review: Joi.object({
            text: Joi.string().required(),
            rating: Joi.number().required().min(1).max(5)
        }).required()
    })
}