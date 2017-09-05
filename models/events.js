var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	leader_name: String,
	leader_last_name: String,
	event_name: String,
	description: String,
	location: String,
	date: String
});

var Events = mongoose.model('Events', eventSchema);

module.exports = {
	Events: Events
};