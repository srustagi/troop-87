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
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		var passedVariable = req.query.success || false;
    	var vm = {
    		success: passedVariable,
    	};
		res.render('members', vm);
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
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		var email = req.body;
		var mailOptions = {
		  from: 'troop87.us@gmail.com',
		  to: 'shivrustagi221@gmail.com',
		  subject: 'Contact form update request',
		  text: email
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
		res.redirect('/members/events?success='+encodeURIComponent('true'));
	});

router.get('/events',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
		event_service.getEvents(function(event_data){
			var passedVariable = req.query.success || false;
			var local_delete_success = req.query.delete_success || false;
	    	var vm = {
	    		success: passedVariable,
	    		dsuccess: local_delete_success,
	    		data: event_data
	    	};
	        res.render('events', vm);
		});
    });

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

router.get('/event/',
	require('connect-ensure-login').ensureLoggedIn(),
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
			res.locals.success = local_success;
			res.locals.delete_success = local_delete_success;
	        res.locals.data = event_data[0];
	        res.locals.id = req.query.id;
	        res.render('event');
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
