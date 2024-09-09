const { web1DB } = require('../config/db');
const mongoose = require("mongoose");
const User = web1DB.model('User', new mongoose.Schema({ uniqueId: String }));

exports.verifyUniqueId = async (req, res) => {
  const { uniqueId } = req.body;

  if (!uniqueId) {
    return res.status(400).json({ message: 'Unique ID is required' });
  }

  try {
    const user = await User.findOne({ uniqueId });

    if (user) {
      return res.status(200).json({ message: 'Unique ID is valid.' });
    } else {
      return res.status(404).json({ message: 'Unique ID not found.' });
    }
  } catch (error) {
    console.error('Error verifying uniqueId:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
