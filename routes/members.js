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
	function(req, res) {
		res.render('login');
	});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/members/login' }),
	function(req, res) {
		res.redirect('/');
	});

router.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	});

router.get('/events',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
        res.render('events');
    });

router.post('/events',
    function(req, res) {
    	event_service.addEvent(req.body, function(err){
    		if(err){
    			var vm = {
					input: req.body,
	    			error: true
    			};
    			return res.render('login', vm);
    		}
        	res.redirect('/');
    	});
    });

module.exports = router;
