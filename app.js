var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Restaurant = require('./models/restaurant');
 
 
//get all restaurant data from db
app.get('/api/restaurants', function(req, res) {
	// use mongoose to get all todos in the database
	Restaurant.find(function(err, restaurants) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(restaurants); // return all restaurant in JSON format
	});
});


// get a restaurants with ID of 1
app.get('/api/restaurants/:restaurant_id', function(req, res) {
	var id = req.params.restaurant_id;
	Restaurant.findById(id, function(err, restaurant) {
		if (err)
			res.status(400).json({err})
            //res.send(err)
            console.log(err);
		res.json(restaurant);
	});
 
});


// create restaurant and send back all restaurants after creation
app.post('/api/restaurants', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Restaurant.create({
		restaurant_id : req.body.restaurant_id,
		name : req.body.name,
		cuisine : req.body.cuisine,
        borough : req.body.borough
	}, function(err, restaurant) {
		if (err)
			res.send(err);
 
		// get and return all the employees after newly created employe record
		Restaurant.find(function(err, restaurants) {
			if (err)
				res.send(err)
			res.json(restaurants);
		});
	});
 
});

app.listen(port);
console.log("App listening on port : " + port);
