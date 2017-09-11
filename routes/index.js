var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',
	function(req, res) {
		res.render('index', { title: 'Express', user: req.user });
	});

// router.get('/login',
// 	require('connect-ensure-login').ensureLoggedOut(),
// 	function(req, res) {
// 		res.render('login');
// 	});

router.get('/error',
	function(req, res, next) {
		next();
	});

module.exports = router;