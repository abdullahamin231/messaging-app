var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const passport = require('passport');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await User.find();
  return res.json({users});
  // res.render('users', {users: users});
});

router.get('/profile', checkAuthenticated, (req, res) => {
  res.render(
    'profile', 
    { 
      title: 'Profile', 
      user: req.user, 
      admin: req.user 
    }
  )
});


router.get('/login', (req, res) => {
  res.render('loginform');
})

router.get('/signup', (req, res) => {
  if(req.isAuthenticated()) res.redirect('/users');
  else
    res.render('signupform');
})

// works for local host
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/users/signup',
//   failureFlash: true,
// }))


// for react  app
// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.status(200).json({ message: 'Authentication successful', data : {user: req.user} });
// });

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Error during authentication process
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      // Authentication failed
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Authentication successful
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.status(200).json({ message: 'Authentication successful', data: { user: req.user } });
    });
  })(req, res, next);
});



router.post('/signup', asyncHandler(async (req, res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const exist = await User.findOne( { email: req.body.email })
    if(!exist){
      const user = new User( {
        username: req.body.username,
        email:req.body.email,
        password: hashedPassword,
      })
      await user.save();
    } else {
      return res.json({ message: 'Account with these credentials already exists' });
    }
    // res.redirect('/users');
    return res.json({ message: 'User created' });    
  } catch {
    return res.json({ message: 'User not created' });
  }
})) 



router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  // res.redirect('/users');
  return res.json({ message: 'User deleted' });
}));

// Route to get user by ID
router.get('/:id', asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
  // res.render('user', { title: 'User', user: user, admin: req.user });
}));

// works for localhost
router.post('/logout', checkAuthenticated , function(req, res, next){
  req.logout( (err) => {
    if(err)
        return next(err);
    res.redirect("/");
  }); 
})

// router.post('/logout', checkAuthenticated, function(req, res, next) {
//   req.logout((err) => {
//       if (err) {
//           return res.status(500).json({ error: 'An error occurred during logout' });
//       }
//       console.log(req.user);
//       return res.json({ message: 'Successfully logged out' });
//   });
// });




function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/users/login');
  }
}

// place where going to that url requires authentication
function checkNotAuthenticated(req, res, next){
  if(!req.isAuthenticated()){
    res.redirect('/users/signup');
  } else {
    // actually render or whatever. // 
    next();
  }
}
module.exports = router;
