const mongoose = require("mongoose");

const JapaneseCuisineSchema = new mongoose.Schema({
  name: String,
    ingredients: mongoose.Schema.Types.Mixed, 
    instructions: [String],
    tips: [String],
    variations: [String]
});

const JapaneseCuisine = mongoose.model("JapaneseCuisine", JapaneseCuisineSchema);

module.exports = JapaneseCuisine;
