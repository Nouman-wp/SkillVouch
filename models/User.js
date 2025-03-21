const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // Used for login
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: '/images/default.png' },
    bio: String,
    skills: [String],  // Example: ["Frontend", "UI/UX", "Python"]
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String
    },
    gigsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    gigsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }]
});

userSchema.plugin(passportLocalMongoose); // Adds password hash & salt

module.exports = mongoose.model('User', userSchema);
