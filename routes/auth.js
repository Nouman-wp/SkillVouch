const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register Route
router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to SkillVouch!');
      res.redirect('/');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/auth/register');
  }
});

// Login Route
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/');
});

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
});

module.exports = router;
