const express = require('express');
const router = express.Router();
const { getCulinaryRecommendations, getCulinaryDetails } = require('../controllers/culinaryController');

router.post('/', getCulinaryRecommendations);
router.post('/details', getCulinaryDetails);

module.exports = router;
