const express = require('express');
const router = express.Router();
const getMedicinalDetails = require('../controllers/medicinalController');

router.post('/', getMedicinalDetails);

module.exports = router;
