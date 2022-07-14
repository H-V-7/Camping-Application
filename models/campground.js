const mongoose = require("mongoose"); //It's an ORM which connects MongoDB to Express 
const Schema = mongoose.Schema

//we created a new mongoDB schema 
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

// here we are compiling our schema before exporting it and it is named as campground
module.exports = mongoose.model("Campground", CampgroundSchema) 