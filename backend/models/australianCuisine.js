const mongoose = require('mongoose');

const AustralianCuisineSchema = new mongoose.Schema({
    name: String,
    ingredients: mongoose.Schema.Types.Mixed, 
    instructions: [String],
    tips: [String],
    variations: [String]
});

const AustralianCuisine = mongoose.model('AustralianCuisine', AustralianCuisineSchema);

module.exports = AustralianCuisine;
