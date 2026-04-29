const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    // Haetaan vain kirjautuneen käyttäjän transaktiot
    const transactions = await Transaction.find({ user_id: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      user_id: req.user.id, // Otetaan ID middlewaresta, ei frontista
    });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
