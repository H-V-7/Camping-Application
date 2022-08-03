const mongoose = require("mongoose");
const { Schema, model } = mongoose; // here we dereferrenced mongoose object to get schema method 

const reviweSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = model("Review", reviweSchema);