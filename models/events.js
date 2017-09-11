var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var People = require('./person');

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
	people: [People.Schema],
	updated: Date
});

var Events = mongoose.model('Events', eventSchema);
var OldEvent = mongoose.model('OldEvent', eventSchema);

module.exports = {
	Events: Events,
	OldEvent: OldEvent
};