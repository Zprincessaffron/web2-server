const express = require('express');
const router = express.Router();
const getBeautyDetails = require('../controllers/beautyController');

router.post('/', getBeautyDetails);

module.exports = router;
