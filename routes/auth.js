const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer storage setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/profiles'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Only JPG, JPEG, or PNG images are allowed'));
    }
    cb(null, true);
  }
});


// GET Register Page

router.get('/register', (req, res) => {
  res.render('auth/register');
});


// POST Register New User

router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email, bio, password, role } = req.body;

    // Input validations
    if (!username || !email || !password) {
      req.flash('error', 'Username, Email, and Password are required!');
      return res.redirect('/auth/register');
    }

    // Set profile image
    let profileImage = '/images/default.png';
    if (req.file) {
      profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const newUser = new User({
      username,
      email,
      bio,
      role,
      profileImage
    });

    const registeredUser = await User.register(newUser, password);

    // Auto login after registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Auto login failed. Please login manually.');
        return res.redirect('/auth/login');
      }
      req.flash('success', 'Registered successfully! Welcome.');
      res.redirect('/');
    });

  } catch (err) {
    console.log(err);
    req.flash('error', err.message);
    res.redirect('/auth/register');
  }
});


// GET Login Page

router.get('/login', (req, res) => {
  res.render('auth/login');
});


// POST Login

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/auth/login'
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/');
});


// GET Logout

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully.');
    res.redirect('/');
  });
});

module.exports = router;
