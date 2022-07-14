// this file will be used for seeding our database with data 
//which will be the dummy data for now

const { default: mongoose } = require("mongoose");
const mongooes = require("mongoose");
//we require the modle which we will be changing
const Campground = require("../models/campground");
//the data which will be seeded is in cities file which is a array containing different
//cities with object 
const cities = require("./cities")

const { descriptors, places } = require("./seedHelpers")


main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb://localhost:27017/camping-api'); //where the mongodb server is listning and the database we want to seed
    console.log("MongoDB Connected");
}





const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`, //string template loteral is used here `${}`
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`
        })

        await camp.save();
    }
}
seedDB().then(() => mongooes.connection.close()); // after svaing data to mongoDB we close the connection so that it dont keep on running 
