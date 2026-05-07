const Budget = require('../models/Budget');

// CREATE - Luo uusi budjetti (max 1 per kuukausi)
exports.createBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // 1. Määritetään kuluvan kuukauden alku- ja loppupisteet
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    // 2. Tarkistetaan, löytyykö tältä kuukaudelta jo budjettia tälle käyttäjälle
    const existingBudget = await Budget.findOne({
      user_id: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        message: 'Tallennus epäonnistui',
        error: 'Olet jo asettanut budjetin tälle kuukaudelle.',
      });
    }

    // 3. Jos ei löydy, luodaan uusi
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
  exports.updateBudget = async (req, res) => {
    try {
      const budgetId = req.params.id;
      const updatedBudget = await Budget.findOneAndUpdate(
        { _id: budgetId, user_id: req.user.id }, // Varmistetaan, että käyttäjä omistaa budjetin
        req.body,
        { new: true },
      );

      if (!updatedBudget) {
        return res.status(404).json({ message: 'Budjettia ei löydy' });
      }
      res.json(updatedBudget);
    } catch (err) {
      res
        .status(400)
        .json({ message: 'Päivitys epäonnistui', error: err.message });
    }
  };
};
