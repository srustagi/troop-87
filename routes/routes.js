var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', passport.authenticate(
	'local',
	{ failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/aids');
    }
);
  
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
