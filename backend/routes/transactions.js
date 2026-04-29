// routes/transactions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Varmista että polku on oikein
const transactionController = require('../controllers/transactionController');

router.get('/', auth, transactionController.getTransactions);
router.post('/', auth, transactionController.createTransaction);

module.exports = router;

module.exports = router;
