var express = require('express');
var router = express.Router();
var passport = require('passport');
var event_service = require('../services/event-service');

router.get('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.render('members');
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

router.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	});

router.get('/events',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
		event_service.getEvents(function(event_data){
			var passedVariable = req.query.success || false;
	    	var vm = {
	    		success: passedVariable,
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

router.get('/event/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
		event_service.getEvent(req.params.id, function(event_data){
	        res.send(event_data[0]);
		});
	});

module.exports = router;
