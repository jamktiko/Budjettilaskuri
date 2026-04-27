/* eslint-disable new-cap */
/*
http://localhost:3000/users/ ei ole tässä sovelluksessa käytössä
*/
const express = require('express');
const router = express.Router();
const uc = require('../controllers/usercontroller'); // user reittien controlleri

// rekisteröityminen eli luodaan uudet tunnarit
// http://localhost:3000/users/register
router.post('/register', uc.registerUser);

// http://localhost:3000/users/login
// kirjtautuminen eli autentikaatio luoduilla tunnareilla
router.post('/login', uc.authenticateUser);
module.exports = router;
