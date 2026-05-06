const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const newBudget = new Budget({
      ...req.body,
      user_id: req.user.id, // Pakotetaan omistajuus middlewaren tunnistamalle käyttäjälle
    });

    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Tallennus epäonnistui', error: err.message });
  }
};

// READ - Hae vain kirjautuneen käyttäjän tapahtumat
exports.getBudgets = async (req, res) => {
  try {
    // Haetaan vain ne dokumentit, joiden user_id vastaa kirjautunutta käyttäjää
    const budgets = await Budget.find({ user_id: req.user.id }).sort({
      date: -1,
    });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Haku epäonnistui', error: err.message });
  }
};
