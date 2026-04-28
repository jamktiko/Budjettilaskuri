const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const checkAuth = require('../middleware/auth');

// Hae kaikki käyttäjän tapahtumat
router.get('/', checkAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user.sub });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Lisää uusi tulo/meno
router.post('/', checkAuth, async (req, res) => {
  const newTx = new Transaction({
    ...req.body,
    user_id: req.user.sub,
  });
  await newTx.save();
  res.json(newTx);
});
router.get('/summary', checkAuth, async (req, res) => {
  const summary = await Transaction.aggregate([
    { $match: { user_id: req.user.sub } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(summary); // Palauttaa [{_id: 'Ruoka', total: 500}, ...]
});
module.exports = router;
