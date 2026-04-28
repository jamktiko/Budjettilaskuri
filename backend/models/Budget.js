const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  budgetcategory: { type: String, required: true },
  budgetamount: { type: Number, required: true },
  period: { type: String, required: true }, // esim. '2024-05'
});

module.exports = mongoose.model('Budget', BudgetSchema);
