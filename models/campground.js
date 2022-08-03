const mongoose = require("mongoose"); //It's an ORM which connects MongoDB to Express 
const Schema = mongoose.Schema

//we created a new mongoDB schema 
const CampgroundSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review" //this will take the reference of the review id which will be associated with a perticular camp
    }]
})

// here we are compiling our schema before exporting it and it is named as campground
module.exports = mongoose.model("Campground", CampgroundSchema); 