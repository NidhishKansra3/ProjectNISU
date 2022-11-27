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
 
 // Step2-1 create restaurant and send back all restaurants after creation
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

// step2-2, step 2-3
app.get('/api/restaurants', function(req, res) {

    const page = req.query.page;
    const perPage  = req.query.perPage;
    const borough = req.query.borough;
  
    Restaurant.find({borough:borough}, function(err, restaurant) {
          if (err)
              res.status(400).json({err})
              //res.send(err)
              console.log(err);
          res.json(restaurant);
      }).limit(perPage);
      
  });


// step2-4 get a restaurants with ID of 1
app.get('/api/restaurants/:restaurant_id', function(req, res) {
    
	var id = req.params.restaurant_id;
	Restaurant.findById(id, function(err, restaurant) {
		if (err)
			res.status(202).json({err})
            //res.send(err)
            console.log(err);
		res.json(restaurant);
	});
 
});



app.listen(port);
console.log("App listening on port : " + port);
