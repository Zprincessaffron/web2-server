const mongoose = require("mongoose");

const IndianCuisineSchema = new mongoose.Schema({
  name: String,
  ingredients: mongoose.Schema.Types.Mixed, 
  instructions: mongoose.Schema.Types.Mixed, 
  tips: [String],
  variations: [String],
});

const IndianCuisine = mongoose.model("IndianCuisine", IndianCuisineSchema);

module.exports = IndianCuisine;
