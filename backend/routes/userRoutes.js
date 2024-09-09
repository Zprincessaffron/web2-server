const express = require('express');
const router = express.Router();
const { verifyUniqueId } = require('../controllers/userController');

router.post('/verify-uniqueId', verifyUniqueId);

module.exports = router;
