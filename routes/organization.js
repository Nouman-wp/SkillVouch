const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/middleware');
const Gig = require('../models/Gig');
const Application = require('../models/Application');

// Organization Dashboard Route
router.get('/org/dashboard', isLoggedIn, async (req, res) => {
    try {
        // Ensure only organization or recruiter role can access
        if (req.user.role !== 'Organization' ) {
            req.flash('error', 'Unauthorized Access');
            return res.redirect('/');
        }

        // Fetch all gigs posted by this organization
        const gigs = await Gig.find({ postedBy: req.user._id });

        // Fetch all applications for these gigs
        const gigIds = gigs.map(gig => gig._id);
        const applications = await Application.find({ gig: { $in: gigIds } })
            .populate('gig')
            .populate('applicant');

        res.render('organization/org-dashboard', { gigs, applications });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load dashboard');
        res.redirect('/');
    }
});

module.exports = router;
