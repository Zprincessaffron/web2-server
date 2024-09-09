const express = require('express');
const router = express.Router();
// const cuisineController = require('../controllers/cuisineController');
const {getAmericanCuisine, getArabianCuisine, getAustralianCuisine, getBeautyAndSkincare, getEuropeanCuisine, getIndianCuisine, getJapaneseCuisine, getMedicinalUsage} = require('../controllers/cuisineController');

router.get('/american-cuisine', getAmericanCuisine);
router.get('/arabian-cuisine', getArabianCuisine);
router.get('/australian-cuisine', getAustralianCuisine);
router.get('/european-cuisine', getEuropeanCuisine);
router.get('/indian-cuisine', getIndianCuisine);
router.get('/japanese-cuisine', getJapaneseCuisine);
router.get('/beautyandskincare', getBeautyAndSkincare);
router.get('/medicinalusage', getMedicinalUsage);

module.exports = router;
