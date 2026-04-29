const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/usercontroller');

// Tämä reitti vastaa polkuun: GET /api/users/me
router.get('/me', auth, userController.syncUser);

module.exports = router;
