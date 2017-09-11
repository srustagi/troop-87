var Events = require('../models/events').Events;
var OldEvent = require('../models/events').OldEvent;
var People = require('../models/person');


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

module.exports.addPerson = function(id, person, callback){
	var newPerson = new People.Person({
		firstname: person.fname,
		lastname: person.lname,
		comment: person.person,
		vehiclecapacity: person.capacity,
		adult: person.adult,
		update: Date.now()
	});
 	Events.findOneAndUpdate({_id: id}, {$push: {people: newPerson}}, {new: true}, function(err){
	    if(err){
	        console.log(err);
	    }
	});
};

module.exports.deleteUser = function(event_id, user_id, callback){
	Events.update( 
        { _id: event_id },
        { $pull: { people : { _id : user_id } } },
        { safe: true },
        function(err) {
        	if(err) console.log(err);
    });
};

module.exports.deleteEvent = function(event_id, callback){
	// Event.findOne({ _id: event_id }, function(err, result) {
	// 	console.log(result);
	//     let swap = new OldEvent(result)
	//     result.remove();
	//     swap.save();
	// });
	Events.find({ _id: event_id }).remove().exec();
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
			callback(err);
		} else {
			callback(event);
		}
	});
};
