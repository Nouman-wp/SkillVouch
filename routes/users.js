const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// User Profile Route
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('users/profile', { currentUser: req.user });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to log in first!');
  res.redirect('/auth/login');
}

// Route to view another user's profile by their ID
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('gigsPosted gigsApplied');
    if (!user) {
      req.flash('error', 'User not found!');
      return res.redirect('back');
    }
    res.render('users/viewProfile', { user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
});




module.exports = router;
