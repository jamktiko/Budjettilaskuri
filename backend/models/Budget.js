const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user_id: {
    type: String, // Koska Users-mallin _id on String (sub)
    ref: 'User', // Tämä auttaa Mongoosea ymmärtämään relaation
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Ruoka', 'Auto', 'Vuokra', 'Viihde', 'Muu'],
  },
  amount: { type: Number, required: true },
  time: { type: String, required: true, enum: ['monthly', 'weekly'] },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Budget', BudgetSchema);
