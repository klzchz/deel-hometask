const express = require('express');
const router = express.Router();
const { getBestProfession,getBestClients } = require('../controllers/adminController');


router.get('/admin/best-profession', getBestProfession);
router.get('/admin/best-clients', getBestClients);
module.exports = router;
// This code defines the route for the best profession API endpoint.