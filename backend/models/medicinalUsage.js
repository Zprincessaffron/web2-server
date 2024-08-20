const mongoose = require("mongoose");

// Define the schema for medicinal usage
const MedicinalUsageSchema = new mongoose.Schema({
  condition: String,
  mechanism: String,
  usage: [
    {
      method: String,
      ingredients: [String],
      preparation: String,
      consumption: String,
    },
  ],
});

const MedicinalUsage = mongoose.model("MedicinalUsage", MedicinalUsageSchema);

module.exports = MedicinalUsage;
