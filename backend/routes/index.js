var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  var username;
  if(req.isAuthenticated())
    username = req.user.username;
  else username = 'Log in';
  // return res.json({name: username});
  res.render('index', { name: username, title: "random" });
});

module.exports = router;
