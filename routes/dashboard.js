const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { ensureAuthenticated } = require('../middleware/auth');

// User Dashboard Route
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Find gigs created by the current user
        const userGigs = await Gig.find({ createdBy: req.user._id });
        res.render('dashboard', { userGigs });
    } catch (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('/');
    }
});

module.exports = router;
