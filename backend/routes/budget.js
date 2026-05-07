const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Varmista että polku on oikein
const budgetController = require('../controllers/budgetcontroller');

router.get('/', auth, budgetController.getBudgets);
router.post('/', auth, budgetController.createBudget);
router.put('/:id', auth, budgetController.updateBudget);

module.exports = router;
