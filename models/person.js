var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
	firstname: String,
	lastname: String,
	comment: String,
	vehiclecapacity: {type: Number, min: 2, max: 8},
	adult: {type:String, enum: ["yes", "no"]},
	updated: Date
});

var Person = mongoose.model('Person', personSchema);

module.exports = {
	Person: Person,
	Schema: personSchema
};