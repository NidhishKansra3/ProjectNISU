/******************************************************************************
 ***
 * ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Suphisara Inphong, Nidhish Kansra Student ID: N01590484, N01490117 Date: 11/26/2022
 * *
 ******************************************************************************
 **/

var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)

var port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

mongoose.connect(database.url);
var Restaurant = require("./models/restaurant");

//Loads the handlebars module
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
var path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

app.use(express.static(path.join(__dirname, "public")));
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/partials/"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      //create custom helper
    },
  })
);

app.set("view engine", "hbs");

// Step2-1 create restaurant and send back all restaurants after creation
app.post("/api/restaurants", function (req, res) {
  // create mongose method to create a new record into collection
  console.log(req.body);

  Restaurant.create(
    {
      restaurant_id: req.body.restaurant_id,
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
    },
    function (err, restaurant) {
      if (err) res.send(err);

      // get and return all the employees after newly created employe record
      Restaurant.find(function (err, restaurants) {
        if (err) res.send(err);
        res.json(restaurants);
      });
    }
  );
});

// step2-2, step 2-3
app.get("/api/restaurants", function (req, res) {
  const page = req.query.page;
  const perPage = req.query.perPage;
  const borough = req.query.borough;

  Restaurant.find({ borough: borough }, function (err, restaurant) {
    if (err) res.status(400).json({ err });
    //res.send(err)
    console.log(err);
    //res.json(restaurant);
    res.render("mydata", { data: restaurant, layout: "main" });
  }).limit(perPage);
});

// step2-4 get a restaurants with ID of 1
app.get("/api/restaurants/:restaurant_id", function (req, res) {
  var id = req.params.restaurant_id;
  Restaurant.findById(id, function (err, restaurant) {
    if (err) res.status(202).json({ err });
    //res.send(err)
    console.log(err);
    res.json(restaurant);
  });
});

//Update record
app.put("/api/restaurants/:restaurant_id", function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.restaurant_id;
  /*var data = {
      title: req.body.title,
      pageCount: req.body.pageCount,
    };*/

  // save the user
  restaurant.findByIdAndUpdate(id, data, function (err, restaurant) {
    if (err) throw err;

    res.send("Successfully! Restaurant updated - " + restaurant.name);
  });
});

//Delete a Restaurant by ID
app.delete("/api/restaurants/:restaurant_id", function (req, res) {
  console.log(req.params.restaurant_id);
  let id = req.params.restaurant_id;
  restaurant.remove(
    {
      _id: id,
    },
    function (err) {
      if (err) res.send(err);
      else res.send("Successfully! Restaurant has been Deleted.");
    }
  );
});

app.listen(port);
console.log("App listening on port : " + port);
