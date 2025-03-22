const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const { isLoggedIn } = require('../middleware/middleware');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

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

// Edit Gig Route
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            req.flash('error', 'Gig not found!');
            return res.redirect('/dashboard');
        }

        if (gig.postedBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You do not have permission to edit this gig.');
            return res.redirect('/dashboard');
        }

        res.render('gigs/edit', { gig });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Gig not found!');
        res.redirect('/dashboard');
    }
});



// Delete Gig Route
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            req.flash('error', 'Gig not found!');
            return res.redirect('/dashboard');
        }

        if (gig.postedBy.toString() !== req.user._id.toString()) {
            req.flash('error', 'You do not have permission to delete this gig.');
            return res.redirect('/dashboard');
        }

        await Gig.findByIdAndDelete(req.params.id);
        req.flash('success', 'Gig deleted successfully!');
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong!');
        res.redirect('/dashboard');
    }
});


// Multer Setup for resume upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed!'));
    }
});

// Apply to a gig with resume upload
router.post('/:id/apply', isLoggedIn, upload.single('resume'), async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) {
            req.flash('error', 'Gig not found');
            return res.redirect('/gigs');
        }

        const application = new Application({
            gig: gig._id,
            applicant: req.user._id,
            message: req.body.message,
            resume: req.file.path
        });

        await application.save();
        req.flash('success', 'Application submitted successfully!');
        res.redirect(`/gigs/${gig._id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to apply. Please try again.');
        res.redirect(`/gigs/${req.params.id}`);
    }
});

// ✅ Final View single gig with applications
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('postedBy');
        if (!gig) {
            req.flash('error', 'Gig not found');
            return res.redirect('/gigs');
        }

        const applications = await Application.find({ gig: gig._id }).populate('applicant');
        res.render('gigs/gigDetails', { gig, applications });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/gigs');
    }
});

module.exports = router;
