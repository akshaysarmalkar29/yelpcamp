const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

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
                  url: 'https://res.cloudinary.com/notorious/image/upload/v1611940297/YelpCamp/ltfholrbpfozfrqgy0rz.jpg',
                  filename: 'YelpCamp/ltfholrbpfozfrqgy0rz'
                },
                {
                  url: 'https://res.cloudinary.com/notorious/image/upload/v1611940298/YelpCamp/di0qzo6vsngzegatovf5.jpg',
                  filename: 'YelpCamp/di0qzo6vsngzegatovf5'
                }
            ],
            price: Math.floor(Math.random() * 500),
            geometry: {
                type: "Point",
                coordinates: [cities[rand1000]["longitude"], cities[rand1000]["latitude"]]
            },
            author: '5ffff2e834d1e243f87bcffb',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam enim excepturi praesentium, facere laboriosam saepe libero ipsam inventore itaque eaque, aspernatur voluptas soluta minus debitis asperiores impedit reprehenderit qui mollitia? Pariatur ea voluptatum sit numquam architecto, nisi laborum, fuga quasi mollitia beatae modi corporis et vero magnam fugit corrupti asperiores.'
        });
        await camp.save();
    }
    console.log("300 Campgrounds Added");
}

seedDb().then(() => {
    mongoose.connection.close();
});