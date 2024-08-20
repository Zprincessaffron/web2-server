const mongoose = require("mongoose");

const BeautyAndSkincareSchema = new mongoose.Schema({
  name: String,
  target: String,
  ingredients: [
    {
      name: {
        type: String,
      },
      quantity: {
        type: String,
      },
    },
  ],
  preparation: [String],
  application: [String],
  frequency: {
    type: String,
  }
});
 
const BeautyAndSkincare = mongoose.model("BeautyAndSkincare", BeautyAndSkincareSchema);
module.exports = BeautyAndSkincare;
