const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // Tämä on Cognito sub
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['tulo', 'meno'], required: true },
  source: { type: String }, // esim. 'manual' tai 'scan'
});

module.exports = mongoose.model('Transaction', TransactionSchema);
