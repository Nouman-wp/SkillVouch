const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
require('./config/passport');
const { isLoggedIn } = require('./middleware/middleware');
const dashboardRoutes = require('./routes/dashboard');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));




// ✅ Just require the file, no need to assign
require('./config/passport');

const authRoutes = require('./routes/auth');

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'skillvouch', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Flash and user middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


// Middleware
app.use('/dashboard', dashboardRoutes);


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', authRoutes);
app.use('/gigs', require('./routes/gigs'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
