const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { isLoggedIn } = require('../middleware/middleware');

// View all gigs
router.get('/', async (req, res) => {
    const gigs = await Gig.find({}).populate('postedBy');
    res.render('gigs/allGigs', { gigs });
});

// Form to create new gig
router.get('/new', isLoggedIn, (req, res) => {
    res.render('gigs/postGig');
});

// Create a new gig
router.post('/', isLoggedIn, async (req, res) => {
    const { title, description, price } = req.body;
    const gig = new Gig({ title, description, price, postedBy: req.user._id });
    await gig.save();
    req.flash('success', 'Gig created successfully!');
    res.redirect('/gigs');
});

// View single gig
router.get('/:id', async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate('postedBy');
    if (!gig) {
        req.flash('error', 'Gig not found');
        return res.redirect('/gigs');
    }
    res.render('gigs/gigDetails', { gig });
});

// Edit Gig Route
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (gig.createdBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You do not have permission to edit this gig.');
            return res.redirect('/dashboard');
        }
        res.render('gigs/edit', { gig });
    } catch (err) {
        req.flash('error', 'Gig not found!');
        res.redirect('/dashboard');
    }
});


// Delete Gig Route
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (gig.createdBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You do not have permission to delete this gig.');
            return res.redirect('/dashboard');
        }
        await Gig.findByIdAndDelete(req.params.id);
        req.flash('success', 'Gig deleted successfully!');
        res.redirect('/dashboard');
    } catch (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('/dashboard');
    }
});





module.exports = router;
