const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
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
