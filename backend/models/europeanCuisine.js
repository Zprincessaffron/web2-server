const mongoose = require('mongoose');

const EuropeanCuisineSchema = new mongoose.Schema({
    name: String,
    ingredients: mongoose.Schema.Types.Mixed, 
    instructions: [String],
    tips: [String],
    variations: [String],
    preparationTime: {
      active: String,
      cooking: String,
      total: String
  }
});

const EuropeanCuisine = mongoose.model('EuropeanCuisine', EuropeanCuisineSchema);

module.exports = EuropeanCuisine;
