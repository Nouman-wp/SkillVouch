const express = require('express');
const router = express.Router();

const app = express();
const { isLoggedIn } = require('../middleware/middleware');
const User = require('../models/User');
const Gig = require('../models/Gig');
const Application = require('../models/Application');

router.get('/', (req, res) => {
  res.render('index.ejs');
});

// About Route
router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/applied', isLoggedIn, async (req, res) => {
  try {
      const user = await User.findById(req.user._id).populate('gigsApplied');
      res.render('users/applied', { gigsApplied: user.gigsApplied });
  } catch (err) {
      console.error(err);
      req.flash('error', 'Unable to fetch applied gigs.');
      res.redirect('/dashboard');
  }
});

router.get('/applied', async (req, res) => {
  try {
      // Ensure user is logged in (Optional: add auth middleware)
      if (!req.isAuthenticated()) {
          return res.redirect('/login');
      }

      // Find applications made by the current user
      const applications = await Application.find({ applicant: req.user._id }).populate('gig');

      // Extract populated gig objects
      const gigsApplied = applications.map(app => app.gig);

      res.render('applied', { gigsApplied });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


module.exports = router;  
