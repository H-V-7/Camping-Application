const Joi = require("joi"); // this packages is used for validatng our scheman for handling errror comming from database 

const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
});

module.exports = campgroundSchema;