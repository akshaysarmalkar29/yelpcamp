const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000]["city"]}, ${cities[rand1000]["state"]}`,
            image: 'https://source.unsplash.com/collection/429524/1600x900',
            price: Math.floor(Math.random() * 500),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam enim excepturi praesentium, facere laboriosam saepe libero ipsam inventore itaque eaque, aspernatur voluptas soluta minus debitis asperiores impedit reprehenderit qui mollitia? Pariatur ea voluptatum sit numquam architecto, nisi laborum, fuga quasi mollitia beatae modi corporis et vero magnam fugit corrupti asperiores.'
        });
        await camp.save();
    }
    console.log("50 Campgrounds Added");
}

seedDb().then(() => {
    mongoose.connection.close();
});