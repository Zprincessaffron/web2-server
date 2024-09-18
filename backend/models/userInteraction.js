const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User', // Assuming you have a User model
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  recipeName: {
    type: String,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  itemName: {
    type: String,
  },
  useCase: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String, 
  },
  category: {
    type: String, 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;
