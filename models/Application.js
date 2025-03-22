const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  resume: String,  // Store resume file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
