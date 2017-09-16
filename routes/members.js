var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var event_service = require('../services/event-service');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'troop87.us@gmail.com',
    pass: 'wintersnow'
  }
});

router.get('/',
	require('connect-ensure-login').ensureLoggedIn({redirectTo: '/members/login'}),
	function(req, res) {
		var local_success = req.query.success || false;
		res.render('members', { success: local_success });
	});

router.get('/login',
	require('connect-ensure-login').ensureLoggedOut(),
	function(req, res) {
		res.render('login');
	});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/members/login' }),
	function(req, res) {
		res.redirect('/members');
	});

router.post('/update-contact',
	require('connect-ensure-login').ensureLoggedIn({redirectTo: '/members/login'}),
	function(req, res){
		var fname = req.body.first_name || req.body.a_first_name;
		var lname = req.body.last_name || req.body.a_last_name;
		var message = "Hi!\n\n" + fname + " " + lname + " has requested an update to their contact information.\n\n";
		if(req.body.phone){
			message = message + "\tPhone: " + req.body.phone + "\n";
		}
		if(req.body.email){
			message = message + "\tEmail: " + req.body.email + "\n";
		}
		if(req.body.address){
			message = message + "\tAddress: " + req.body.address + "\n";
		}
		
		if(req.body.p_first_name){
			message = message + "\tParent 1 First Name: " + req.body.p_first_name + "\n";
		}
		if(req.body.p_last_name){
			message = message + "\tParent 1 Last Name: " + req.body.p_last_name + "\n";
		}
		if(req.body.p_phone){
			message = message + "\tParent 1 Phone: " + req.body.p_phone + "\n";
		}
		if(req.body.p_phone_2){
			message = message + "\tParent 1 Alternate Phone: " + req.body.p_phone_2 + "\n";
		}
		if(req.body.p_email){
			message = message + "\tParent 1 Email: " + req.body.p_email + "\n";
		}
		if(req.body.p_address){
			message = message + "\tParent 1 Address: " + req.body.p_address + "\n";
		}

		if(req.body.p2_first_name){
			message = message + "\tParent 2 First Name: " + req.body.p2_first_name + "\n";
		}
		if(req.body.p2_last_name){
			message = message + "\tParent 2 Last Name: " + req.body.p2_last_name + "\n";
		}
		if(req.body.p2_phone){
			message = message + "\tParent 2 Phone: " + req.body.p2_phone + "\n";
		}
		if(req.body.p2_phone_2){
			message = message + "\tParent 2 Alternate Phone: " + req.body.p2_phone_2 + "\n";
		}
		if(req.body.p2_email){
			message = message + "\tParent 2 Email: " + req.body.p2_email + "\n";
		}
		if(req.body.p2_address){
			message = message + "\tParent 2 Address: " + req.body.p2_address + "\n";
		}
		
		if(req.body.a_phone){
			message = message + "\tPhone: " + req.body.a_phone + "\n";
		}
		if(req.body.a_email){
			message = message + "\tEmail: " + req.body.a_email + "\n";
		}
		if(req.body.a_address){
			message = message + "\tAddress: " + req.body.a_address + "\n";
		}
		message = message + "\nThanks!";

		var mailOptions = {
		  from: 'troop87.us@gmail.com',
		  to: 'shivrustagi221@gmail.com',
		  subject: 'Contact form update request',
		  text: message
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
		res.redirect('/members/?success='+encodeURIComponent('true'));
	});

router.get('/events',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/members/login'}),
    function(req, res) {
		event_service.getEvents(function(event_data){
			var local_success = req.query.success || false;
			var local_delete_success = req.query.delete_success || false;
	    	var vm = {
	    		success: local_success,
	    		dsuccess: local_delete_success,
	    		data: event_data
	    	};
	        res.render('events', vm);
		});
    });


//TODO: preserve form data with and figure out what went wrong, display splash message to user
router.post('/events',
    function(req, res) {
    	event_service.addEvent(req.body, function(err){
    		if(err){
    			return res.redirect('/members/events');
    		}
        	event_service.getEvents(function(event_data){
		        res.redirect('/members/events?success='+encodeURIComponent('true'));
			});
    	});
    });

//TODO: figure out next() call
router.get('/event/',
	require('connect-ensure-login').ensureLoggedIn({redirectTo: '/members/login'}),
	function(req, res){
		if(!req.query.id){
			return res.redirect('/members/events');
		}
		event_service.getEvent(req.query.id, function(event_data){
			if(event_data instanceof Error){
				res.redirect('/error');
			}
			var local_success = req.query.success || false;
			var local_delete_success = req.query.delete_success || false;
	        res.render('event', { 
	        	success: local_success,
	        	delete_success: local_delete_success,
	        	data: event_data[0],
	        	id: req.query.id 
	        });
		});
	});

router.post('/event',
    function(req, res) {
    	var eventid = req.body.id;
    	var form_data = req.body;
    	delete form_data.id;
     	event_service.addPerson(eventid, form_data, function(err){
    		if(err){
    			return res.redirect('/members/event?id='+encodeURIComponent(eventid)+'&success='+encodeURIComponent('false'));
    		}
    	});
    	res.redirect('/members/event/?id='+encodeURIComponent(eventid)+'&success='+encodeURIComponent('true'));
    });

router.post('/event/delete',
    function(req, res) {
    	event_service.deleteUser(req.body.event, req.body.user_fname, function(err){
    		if(err){
    			return res.redirect('/members/event?id='+encodeURIComponent(req.body.event)+'&delete_success='+encodeURIComponent('false'));
    		}
    	});
    	res.redirect('/members/event/?id='+encodeURIComponent(req.body.event)+'&delete_success='+encodeURIComponent('true'));
    });

router.post('/events/delete',
    function(req, res) {
    	event_service.deleteEvent(req.body.event, function(err){
    		if(err){
    			return res.redirect('/members/events');
    		}
    	});
    	res.redirect('/members/events/?delete_success='+encodeURIComponent('true'));
    });

router.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	});

module.exports = router;
