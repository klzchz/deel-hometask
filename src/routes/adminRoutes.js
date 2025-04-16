const express = require('express');
const router = express.Router();
const { getBestProfession } = require('../controllers/adminController');

router.get('/admin/best-profession', getBestProfession);

module.exports = router;
// This code defines the route for the best profession API endpoint.