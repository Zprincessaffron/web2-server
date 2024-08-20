const express = require('express');
const mongoose = require('mongoose');
const AmericanCuisine = require('./models/americanCuisine.js');
const ArabianCuisine = require('./models/arabianCuisine.js');
const AustralianCuisine = require('./models/australianCuisine.js');
const BeautyAndSkincare = require('./models/beautyandskincare.js');
const EuropeanCuisine = require('./models/europeanCuisine.js');
const IndianCuisine = require('./models/indianCuisine.js');
const JapaneseCuisine = require('./models/japaneseCuisine.js');
const MedicinalUsage = require('./models/medicinalUsage.js');
const env = require('dotenv').config()
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials
}));

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// GET route to retrieve data from
app.get('/api/american-cuisine', async (req, res) => {
  try {
      const cuisineData = await AmericanCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/arabian-cuisine', async (req, res) => {
  try {
      const cuisineData = await ArabianCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/australian-cuisine', async (req, res) => {
  try {
      const cuisineData = await AustralianCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/european-cuisine', async (req, res) => {
  try {
      const cuisineData = await EuropeanCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/indian-cuisine', async (req, res) => {
  try {
      const cuisineData = await IndianCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/japanese-cuisine', async (req, res) => {
  try {
      const cuisineData = await JapaneseCuisine.find();
      if (!cuisineData.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(cuisineData);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/beautyandskincare', async (req, res) => {
  try {
      const Data = await BeautyAndSkincare.find();
      if (!Data.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(Data);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/medicinalusage', async (req, res) => {
  try {
      const Data = await MedicinalUsage.find();
      if (!Data.length) {
          return res.status(404).json({ message: 'No data found' });
      }
      res.json(Data);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
