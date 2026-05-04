const Transaction = require('../models/Transaction');

// CREATE - Lisää uusi tapahtuma
exports.createTransaction = async (req, res) => {
  try {
    // Luodaan uusi transaktio req.body-tiedoilla
    const newTransaction = new Transaction({
      ...req.body,
      user_id: req.user.id, // Pakotetaan omistajuus middlewaren tunnistamalle käyttäjälle
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Tallennus epäonnistui', error: err.message });
  }
};

// READ - Hae vain kirjautuneen käyttäjän tapahtumat
exports.getTransactions = async (req, res) => {
  try {
    // Haetaan vain ne dokumentit, joiden user_id vastaa kirjautunutta käyttäjää
    const transactions = await Transaction.find({ user_id: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Haku epäonnistui', error: err.message });
  }
};
