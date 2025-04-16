const express = require('express');
const router = express.Router();
const { getUnpaidJobs } = require('../controllers/jobController');
const { getProfile } = require('../middleware/getProfile');

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);

module.exports = router;
// This code defines the routes for the job-related API endpoints.