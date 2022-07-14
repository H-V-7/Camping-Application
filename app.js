const express = require("express"); //initializing expresss object and the executing to use the methods within it 
//inside app to use its functions
const path = require("path") //we use path for linking directories and in this case we are linking our 
//views diectory to our app file and after this we can run it from anywhere 
const mongoose = require("mongoose") //ORM for mongoDB and we need it to connect our app to mongoDB server

const Campground = require("./models/campground") //campground collection

const methodOverride = require("method-override"); //used for overriding the traditional methods sho that we can use other HTTP verbs



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/camping-api');
    console.log("MongoDB Connected");
}

const db = mongoose.connection;

const app = express();

app.use(express.urlencoded({ extended: true })); //used to parse the incoming request which in this case is used with form
//as on submitting the form sends a request and data in its body.
//Basically it is used to parse the request body (req) and use the data coming as JSON payload

app.use(methodOverride("_method")); //the string here will be used as query string

app.set("view engine", "ejs"); //we are stting our view engien as ejs 
app.set("views", path.join(__dirname, "views"));


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

})

//endpoint for form submission  
app.post("/campgrounds", async (req, res) => {
    //first we created a instance of camp using new key word and then
    //we used its id to redirect to the newly created camp.
    const newCamp = new Campground(req.body);
    await newCamp.save()
        .then(() => res.redirect(`campgrounds/${newCamp._id}`))
        .catch((error) => console.log(error));
})

app.get("/campgrounds/:id", async (req, res) => {
    await Campground.findById(req.params.id)
        .then((result) => res.render("campgrounds/show", { result }))
        .catch((error) => console.log(error))
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    await Campground.findById(req.params.id)
        .then((result) => res.render("campgrounds/edit", { result }))
        .catch((error) => console.log(error))
});
//endpoitn for edit form 
app.put("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => res.redirect(`/campgrounds/${result._id}`))
        .catch((error) => console.log(error))
});

app.delete("/ campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
        .then(() => res.redirect("/campgrounds"))
        .catch((error) => console.log(error))
})

//here we sepicfy the port on which the our server will run  
app.listen(3000, () => {
    console.log("server started");
});