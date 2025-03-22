const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer storage setup
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

// Register Route

router.get('/register', (req, res) => {
  res.render('auth/register');
});


router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email, bio, password } = req.body;


    if (!username) {
      req.flash('error', 'Username is required');
      return res.redirect('/auth/register');
    }

    let profileImage = '/images/default.png';
    if (req.file) {
      profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const newUser = new User({
      username,
      email,
      bio,
      profileImage
    });

    
    const registeredUser = await User.register(newUser, password);

    
    req.login(registeredUser, (err) => {
      if (err) {
        console.log(err);
        return res.redirect('/auth/login');
      }
      req.flash('success', 'Registered successfully');
      res.redirect('/');
    });

  } catch (err) {
    console.log(err);
    req.flash('error', err.message);
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



// REGISTER Route
router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email, bio, password } = req.body;
    let profileImage = '/images/default.png'; // Default image path

    if (req.file) {
      profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const newUser = new User({
      username,
      email,
      bio,
      profileImage
    });

    await User.register(newUser, password);
    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    res.redirect('/auth/register');
  }
});



module.exports = router;
