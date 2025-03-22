const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: '/images/default.png' },
    bio: String,
    skills: [String], 
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String
    },
    role: {
        type: String,
        enum: ['Applicant', 'Recruiter', 'Organization'],
        default: 'Applicant'
    },
    gigsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    gigsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }]
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
