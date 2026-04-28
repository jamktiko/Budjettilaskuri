const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // Cognito sub
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  source: { type: String, default: 'manual' }, // scan tai manual
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
