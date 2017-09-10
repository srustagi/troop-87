var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	firstname: String,
	lastname: String,
	contact: String,
	event_name: String,
	description: String,
	location: String,
	startdate: String,
	enddate: String,
	starttime: String,
	endtime: String,
	updated: Date
});

var Events = mongoose.model('Events', eventSchema);

module.exports = {
	Events: Events
};