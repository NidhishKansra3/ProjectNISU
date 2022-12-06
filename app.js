/******************************************************************************
 ***
 * ITE5315 – Project
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Group Member  Name: Suphisara Inphong Student ID: N01590484 Date: 11/28/2022
 *               Name: Nidhish Kansra    Student ID: N01490117 Date: 11/28/2022
 * *
 ******************************************************************************
 **/

var express = require("express");
var mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser");
var port = process.env.PORT || 4000;
const authorization = require("./middleware/authorization"); // pull information from HTML POST (express4)

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
//registring user
app.post("/registeruser", async (req, res) => {
  console.log(req.body);
  try {
    //user input
    const { first_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Creating user in our database
    const user = await User.create({
      first_name,
      email: email.toLowerCase(), //convert email to lowercase
      password: encryptedPassword,
    });
    console.log("here");
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

//login user
app.post("/loginuser", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
      console.log("first if");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      console.log("second if");
      // user
      res.status(200).json(user);
    } else {
      console.log("after try");
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

// Step2-1 create restaurant and send back all restaurants after creation
app.post("/api/restaurants", authorization, function (req, res) {
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

      // get and return all the restaurant after newly created restaurant record
      Restaurant.find(function (err, restaurants) {
        if (err) res.send(err);

        res.json(restaurants);
        console.log("Restaurant successfully created");
      });
    }
  );
});

// step2-2, step 2-3
app.get("/api/restaurants", authorization, function (req, res) {
  const page = req.query.page;
  const perPage = req.query.perPage;
  const borough = req.query.borough;
  const skip = (page - 1) * perPage;

  Restaurant.find({ borough: borough }, function (err, restaurant) {
    if (err) res.status(400).json({ err });
    console.log(err);

    res.json(restaurant);
    //res.render("mydata", { data: restaurant, layout: "main" });
  })
    .skip(skip)
    .limit(perPage);
});

// step2-4 get a restaurants with ID of 1
app.get("/api/restaurants/:restaurant_id", authorization, function (req, res) {
  var id = req.params.restaurant_id;
  Restaurant.findById(id, function (err, restaurant) {
    if (err) res.status(204).json({ err });
    console.log(err);

    res.json(restaurant);
  });
});

//Update record
app.put("/api/restaurants/:restaurant_id", authorization, function (req, res) {
  // create mongose method to update an existing record into collection
  console.log(req.body);

  let id = req.params.restaurant_id;
  var data = {
    restaurant_id: req.body.restaurant_id,
    name: req.body.name,
    cuisine: req.body.cuisine,
    borough: req.body.borough,
  };

  // save the user
  Restaurant.findByIdAndUpdate(id, data, function (err, restaurant) {
    if (err) throw err;

    res.send("Successfully! Restaurant updated - " + restaurant.name);
  });
});

//Delete a Restaurant by ID
app.delete(
  "/api/restaurants/:restaurant_id",
  authorization,
  function (req, res) {
    console.log(req.params.restaurant_id);
    let id = req.params.restaurant_id;
    Restaurant.deleteOne(
      {
        _id: id,
      },
      function (err) {
        if (err)
          //res.send(err);
          res.status(500).json({ err });
        else res.send("Successfully! Restaurant has been Deleted.");
      }
    );
  }
);

app.listen(port);
console.log("App listening on port : " + port);
