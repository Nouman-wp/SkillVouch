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

module.exports = router;
