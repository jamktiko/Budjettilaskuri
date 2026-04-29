const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Käytämme _id-kenttänä Cogniton 'sub'-tunnusta (merkkijono)
  _id: { type: String, required: true },
  email: { type: String, required: true },
  nimi: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
