var Events = require('../models/events').Events;

module.exports.addEvent = function(event, next){
	var newEvent = new Events({
		firstname: event.fname,
		lastname: event.lname,
		contact: event.email,
		event_name: event.name,
		description: event.description,
		location: event.location,
		startdate: event.sdate,
		enddate: event.edate,
		starttime: event.stime,
		endtime: event.etime,
		updated: Date.now()
	});

	newEvent.save(function(err) {
		if (err) {
			return next(err);
		}
		next(null);
	});
};

module.exports.getEvents = function(callback){
	Events.find(function(err, events){
		if(err){
			console.log(err);
		} else {
			callback(events);
		}
	});
};

module.exports.getEvent = function(id, callback){
	Events.find({'_id': id}, function(err, event){
		if(err){
			console.log(err);
		} else {
			callback(event);
		}
	});
};

