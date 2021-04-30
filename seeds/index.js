
require('dotenv').config();

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000]["city"]}, ${cities[rand1000]["state"]}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/akshay74/image/upload/v1616735780/YelpCamp/rkt5evut4fjc9wf5qoxu.jpg',
                  filename: 'YelpCamp/ltfholrbpfozfrqgy0rz'
                },
                {
                  url: 'https://res.cloudinary.com/akshay74/image/upload/v1616735775/YelpCamp/epqiesqaggryut8mfqwb.jpg',
                  filename: 'YelpCamp/di0qzo6vsngzegatovf5'
                }
            ],
            price: Math.floor(Math.random() * 500),
            geometry: {
                type: "Point",
                coordinates: [cities[rand1000]["longitude"], cities[rand1000]["latitude"]]
            },
            author: '608bfb7b9e2a6b22bb0672b6',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam enim excepturi praesentium, facere laboriosam saepe libero ipsam inventore itaque eaque, aspernatur voluptas soluta minus debitis asperiores impedit reprehenderit qui mollitia? Pariatur ea voluptatum sit numquam architecto, nisi laborum, fuga quasi mollitia beatae modi corporis et vero magnam fugit corrupti asperiores.'
        });
        await camp.save();
    }
    console.log("300 Campgrounds Added");
}

seedDb().then(() => {
    mongoose.connection.close();
});