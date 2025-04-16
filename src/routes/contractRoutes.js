const express = require('express');
const router = express.Router();
const { getContractById, getUserContracts } = require('../controllers/contractController');
const { getProfile } = require('../middleware/getProfile');

router.get('/contracts/:id', getProfile, getContractById);
router.get('/contracts', getProfile, getUserContracts);

module.exports = router;
// This code defines the routes for the contract-related API endpoints.