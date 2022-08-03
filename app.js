const express = require("express"); //initializing expresss object and the executing to use the methods within it 
//inside app to use its functions
const path = require("path"); //we use path for linking directories and in this case we are linking our 
//views diectory to our app file and after this we can run it from anywhere 
const mongoose = require("mongoose"); //ORM for mongoDB and we need it to connect our app to mongoDB server

const Campground = require("./models/campground"); //campground collection

const Review = require("./models/review"); //review collection

const methodOverride = require("method-override"); //used for overriding the traditional methods sho that we can use other HTTP verbs

const ejsMate = require("ejs-mate"); //ejs templating packgae 

const ExpressError = require("./utils/ExpressError"); //custom Error handler 

const campgroundSchema = require("./Schemas"); //this is for schma validation 

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/camping-api');
    console.log("MongoDB Connected");
}



const app = express();

app.use(express.urlencoded({ extended: true })); //used to parse the incoming request which in this case is used with form
//as on submitting the form sends a request and data in its body.
//Basically it is used to parse the request body (req) and use the data coming as JSON payload

app.use(methodOverride("_method")); //the string here will be used as query string

app.engine("ejs", ejsMate); //setting a default template engine

app.set("view engine", "ejs"); //we are stting our view engien as ejs 
app.set("views", path.join(__dirname, "views"));

//We use joi inside a middelware so that it can be acessed by routes handlers which requires validation
const validateCampground = (req, res, next) => {

    //we have a object named error in whch we will  get a property called error and we
    //can dispaly the error details for user
    const { error } = campgroundSchema.validate(req.body); // we using validate method to validate our incoming body
    if (error) {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg, 400) //here we used map as  the error message was a array which stores 
        //messages and if we have multiple error then we  need to display all of them which will be
        //seperated by a comma becasue of join method
    }
    else {
        next();
    };

};


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    await Campground.find({}) //this returns us the object from the MongoDB as it is stored in the form of object
        .then((result) => res.render("campgrounds/index", { result })) //here we pass the incoming objects from the await to the render function
        // //which will then make it available for us in html and then we can access this data in our html views.
        .catch((error) => console.log(error))
});

//here we simply render the form which can be used for adding new
//camp ground 
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");

});

//endpoint for form submission  
//we passed next here so that the error will be catched by express and this will be passed to our error handler middleware
app.post("/campgrounds", validateCampground, async (req, res, next) => {
    //first we created a instance of camp using new key word and then
    //we used its id to redirect to the newly created camp.
    if (!req.body) throw new ExpressError("Invalid Campgorund Data", 404);
    const newCamp = new Campground(req.body);
    await newCamp.save()
        .then(() => res.redirect(`campgrounds/${newCamp._id}`))
        .catch((error) => next(error));
});

app.get("/campgrounds/:id", async (req, res, next) => {
    await Campground.findById(req.params.id)
        .then((result) => res.render("campgrounds/show", { result }))
        .catch((error) => next(error))
});

app.get("/campgrounds/:id/edit", async (req, res, next) => {
    await Campground.findById(req.params.id)
        .then((result) => res.render("campgrounds/edit", { result }))
        .catch((error) => next(error))
});
//endpoitn for edit form 
app.put("/campgrounds/:id", validateCampground, async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => res.redirect(`/campgrounds/${result._id}`))
        .catch((error) => next(error))
});

app.delete("/campgrounds/:id", async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id)
        .then(() => res.redirect("/campgrounds"))
        .catch((error) => next(error))
});

//this route is endpoint  for reviews which will be associtaed with a perticulaer campgoround 
app.post("/campgrounds/:id/reviews", async (req, res) => {
    await Campground.findById(req.param.id)

});




//this here is a basic error handler which will handle the error 
//for the page which is not present here 
//this all method applies the path, middlewre and callback with every HTTP methods
//this will make sure that the page which don't exist will be handled by this method middleware
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404)); //here next woill pass this error to the express error and it will then be processed in the middleware by the help of next keyword
});




//for handling error we can make new middleware which will handle our error
//this middelware will hamdle the error logic and we can send
//status codes, error messages using our own classes and even render a template  
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", { err });
});



//here we sepicfy the port on which the our server will run  
app.listen(3000, () => {
    console.log("server started");
}); 
