const express = require('express');
const router = express.Router();
const getPregnancyDetails = require('../controllers/pregnancyController');

router.post('/', getPregnancyDetails);

module.exports = router;
