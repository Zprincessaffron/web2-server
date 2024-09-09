const mongoose = require("mongoose");
const PregnantWomenSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  recipes: [
    {
      name: String,
      ingredients: [String],
      preparation: [String],
      consumption: String,
      frequency: {
        type: String,
        default: null,
      },
    },
  ],
});

const PregnantWomen = mongoose.model("PregnantWomen", PregnantWomenSchema);

module.exports = PregnantWomen;


