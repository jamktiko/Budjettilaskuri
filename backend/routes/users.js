const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth'); // Se tiedosto, jonka loit aiemmin

// Tämä reitti on suojattu
router.get('/profiili', checkAuth, (req, res) => {
  // req.user sisältää nyt Cogniton purkamat tiedot (esim. sub, email)
  res.json({
    viesti: 'Tervetuloa, olet kirjautunut sisään!',
    kayttaja_id: req.user.sub,
    sahkoposti: req.user.email,
  });
});

module.exports = router;
