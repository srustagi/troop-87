var express = require('express');
var router = express.Router();
var event_service = require('../services/event-service');
/* create event with form */

router.get('/',
    function(req, res) {
        res.render('events');
    });

router.post('/',
    function(req, res) {
    	event_service.addEvent(req.body, function(err){
    		if(err){
    			var vm = {
					input: req.body,
	    			error: 'Something went wrong'
    			};
    			return res.render('/', vm);
    		}
        	res.redirect('/');
    	});
    });

module.exports = router;