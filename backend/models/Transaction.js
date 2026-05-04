const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Transaktion oma ID tulee automaattisesti MongoDB:ltä (ObjectId),
  // ellet määritä sitä itse. Se on eri kuin user_id.

  user_id: {
    type: String, // Koska Users-mallin _id on String (sub)
    ref: 'User', // Tämä auttaa Mongoosea ymmärtämään relaation
    required: true,
  },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String },
  source: { type: String, default: 'manual' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
