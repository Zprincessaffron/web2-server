const mongoose = require('mongoose');

const AmericanCuisineSchema = new mongoose.Schema({
    name: String,
    ingredients: mongoose.Schema.Types.Mixed, 
    instructions: [String],
    tips: [String],
    variations: [String]
});

const AmericanCuisine = mongoose.model('AmericanCuisine', AmericanCuisineSchema);

module.exports = AmericanCuisine;
