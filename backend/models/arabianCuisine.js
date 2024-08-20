const mongoose = require('mongoose');

const ArabianCuisineSchema = new mongoose.Schema({
    name: String,
    ingredients: mongoose.Schema.Types.Mixed, 
    instructions: [String],
    tips: [String],
    variations_and_additions: [String],
    alternative_recipes: [String],
    storage: [String]
});

const ArabianCuisine = mongoose.model('ArabianCuisine', ArabianCuisineSchema);

module.exports = ArabianCuisine;
