const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/middleware');
const Gig = require('../models/Gig');
const Application = require('../models/Application');

// Recruiter Dashboard Route
router.get('/rec/dashboard', isLoggedIn, async (req, res) => {
    try {
        // Ensure only recruiters can access this route
        if (req.user.role !== 'Recruiter') {
            req.flash('error', 'Unauthorized Access');
            return res.redirect('/');
        }

        // Fetch all gigs posted by this recruiter
        const gigs = await Gig.find({ postedBy: req.user._id });

        // Fetch applications received for these gigs
        const gigIds = gigs.map(gig => gig._id);
        const applications = await Application.find({ gig: { $in: gigIds } })
            .populate('gig')
            .populate('applicant');

        res.render('recruiter/rec-dashboard', { gigs, applications });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load recruiter dashboard');
        res.redirect('/');
    }
});

module.exports = router;
