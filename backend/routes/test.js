const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/test-db
router.get('/test-db', (req, res) => {
  const status = mongoose.connection.readyState;
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting
  if (status === 1) {
    res.json({ message: 'Yhteys tietokantaan on kunnossa!', status: 'OK' });
  } else {
    res
      .status(500)
      .json({ message: 'Ei yhteyttä tietokantaan', status: 'ERROR' });
  }
});

module.exports = router;
