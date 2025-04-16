const express = require('express');
const router = express.Router();
const { depositBalance } = require('../controllers/balanceController');
const { getProfile } = require('../middleware/getProfile');

router.post('/balances/deposit/:userId', getProfile, depositBalance);

module.exports = router;
// This code defines the route for the balance deposit API endpoint.