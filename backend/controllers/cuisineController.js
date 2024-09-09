// controllers/cuisineController.js
const AmericanCuisine = require('../models/americanCuisine');
const ArabianCuisine = require('../models/arabianCuisine');
const AustralianCuisine = require('../models/australianCuisine');
const BeautyAndSkincare = require('../models/beautyandskincare');
const EuropeanCuisine = require('../models/europeanCuisine');
const IndianCuisine = require('../models/indianCuisine');
const JapaneseCuisine = require('../models/japaneseCuisine');
const MedicinalUsage = require('../models/medicinalUsage');

const getCuisineData = async (Model, res) => {
  try {
    const cuisineData = await Model.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: 'No data found' });
    }
    res.json(cuisineData);
  } catch (error) {
    console.error('Error fetching cuisine data:', error.message || error);
    res.status(500).json({ message: 'Server Error', error: error.message || error });
  }
};

exports.getAmericanCuisine = (req, res) => {
  getCuisineData(AmericanCuisine, res);
};

exports.getArabianCuisine = (req, res) => {
  getCuisineData(ArabianCuisine, res);
};

exports.getAustralianCuisine = (req, res) => {
  getCuisineData(AustralianCuisine, res);
};

exports.getEuropeanCuisine = (req, res) => {
  getCuisineData(EuropeanCuisine, res);
};

exports.getIndianCuisine = (req, res) => {
  getCuisineData(IndianCuisine, res);
};

exports.getJapaneseCuisine = (req, res) => {
  getCuisineData(JapaneseCuisine, res);
};

exports.getBeautyAndSkincare = (req, res) => {
  getCuisineData(BeautyAndSkincare, res);
};

exports.getMedicinalUsage = (req, res) => {
  getCuisineData(MedicinalUsage, res);
};
