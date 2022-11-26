// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ResSchema = new Schema({
    adress : {building : String,
              coord: {'0': Object,
                    '1':Object
            },
              street : String,
              zipcode : String},
    borough : String,
	cuisine : String,
    grades : {0:Object,
              1:Object,
              2:Object,
              3:Object},
    name : String,
    restaurant_id : String
});

module.exports = mongoose.model('restuaRant', ResSchema);