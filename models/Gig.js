const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,

    location: {
        type: String,  // e.g., "Delhi, India"
        default: "Remote"
    },

    mode: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'Remote'
    },

    skillsRequired: [{
        type: String  // Example: ["JavaScript", "React", "Node.js"]
    }],

    deadline: {
        type: Date  // Optional deadline for the gig
    },

    image: {
        type: String,
        default: '/images/default-job.png'  // Optional gig image for UI
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Gig', gigSchema);
