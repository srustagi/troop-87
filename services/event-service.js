var Events = require('../models/events').Events;

module.exports.addEvent = function(event, next){
	var newEvent = new Events({
		leader_name: event.leader_name,
		leader_last_name: event.leader_last_name,
		event_name: event.event_name,
		description: event.description,
		location: event.location,
		date: event.date
	});

	newEvent.save(function(err) {
		if (err) {
			return next(err);
		}
		next(null);
	});
};