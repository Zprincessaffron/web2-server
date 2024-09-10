const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const AmericanCuisine = require('./models/americanCuisine.js');
const ArabianCuisine = require('./models/arabianCuisine.js');
const AustralianCuisine = require('./models/australianCuisine.js');
const BeautyAndSkincare = require('./models/beautyandskincare.js');
const EuropeanCuisine = require('./models/europeanCuisine.js');
const IndianCuisine = require('./models/indianCuisine.js');
const JapaneseCuisine = require('./models/japaneseCuisine.js');
const MedicinalUsage = require('./models/medicinalUsage.js');
const culinaryRoutes = require('./routes/culinaryRoutes.js')
const beautyRoutes = require('./routes/beautyRoutes.js')
const medicinalRoutes = require('./routes/medicinalRoutes.js')
const PregnantWomen  = require('./models/pregnantwomen.js');
const pregnancyRoutes = require('./routes/pregnancyRoutes.js')
const crypto = require('crypto'); // For generating OTP
const nodemailer = require('nodemailer'); // For sending emails
const twilio = require('twilio'); // For sending SMS
const { body, validationResult } = require('express-validator');
const env = require('dotenv').config()
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserInteraction = require('./models/userInteraction.js');


const app = express();
const PORT = process.env.PORT;

// const allowedOrigins = ['https://web2-client-eosin.vercel.app'];
// http://localhost:5173
const corsOptions = {
    origin: 'https://web2-client-eosin.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Allow credentials
  };
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight OPTIONS request for all routes

  

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.mongoURI)
    .then(() => console.log('web-2 MongoDB connected'))
    .catch(err => console.log(err));

// Second MongoDB connection using createConnection
const web1DB = mongoose.createConnection(process.env.Web1_mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

web1DB.on('connected', () => {
    console.log('web-1 MongoDB connected');
});

web1DB.on('error', (err) => {
    console.log(`web-1 MongoDB connection error: ${err}`);
});


app.use('/api/culinary', culinaryRoutes);
app.use('/api/beauty', beautyRoutes);
app.use('/api/medicinal', medicinalRoutes);
app.use('/api/pregnancy', pregnancyRoutes);

// GET route to retrieve data from
app.get("/test", (req, res) => {
    res.json("Hello World");
});

// Define the User model for the connection
const User = web1DB.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    purchasedSite: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true }, // Unique ID to be generated
    otp: { type: String }, // Store OTP if needed
    phOtp : { type: String },
    otpExpires: { type: Date }, // Store OTP expiration time
}));



// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

// Function to format phone numbers to E.164 format
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return null;
    // Ensure phone number is in E.164 format
    return phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
};



app.post('/api/register', async (req, res) => {
    const { name, email, phone, password, purchasedSite } = req.body;

    // Validate request data
    if (!name || !password || !purchasedSite) {
        return res.status(400).json({ message: 'Name, password, and purchased site are required.' });
    }

    try {
        // Check if the email or phone is already registered
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or phone number already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique ID based on the name and current timestamp
        const uniqueId = `${name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;

        // Generate a 6-digit OTP and set expiration time (15 minutes)
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 15 * 60 * 1000;

        // Create a new user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            purchasedSite,
            uniqueId,
            otp,
            otpExpires,
        });

        // Save the user to the database before sending OTP
        await newUser.save();

        // Send OTP via Email or SMS
        if (email) {
            await transporter.sendMail({
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is ${otp}. It will expire in 15 minutes.`
            });
            console.log(`OTP sent to ${email}`);
        }

        // Return success response with user data (excluding the password)
        res.status(201).json({
            message: 'User registered successfully. OTP has been sent.',
            userData: {
                name: newUser.name,
                email: newUser.email,
                purchasedSite: newUser.purchasedSite,
                uniqueId: newUser.uniqueId
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Endpoint to verify uniqueId
app.post('/api/verify-uniqueId', async (req, res) => {
    const { uniqueId } = req.body;

    if (!uniqueId) {
        return res.status(400).json({ message: 'Unique ID is required' });
    }

    try {
        // Verify if uniqueId exists in the database
        const user = await User.findOne({ uniqueId });

        if (user) {
            // Return the user data along with a success message
            return res.status(200).json({ 
                message: 'Unique ID is valid.', 
                userData: {
                    name: user.name,
                    email: user.email,
                    purchasedSite: user.purchasedSite,
                    uniqueId: user.uniqueId
                }
            });
        } else {
            return res.status(404).json({ message: 'Unique ID not found.' });
        }
    } catch (error) {
        console.error('Error verifying uniqueId:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// // Endpoint to verify OTP
app.post('/api/verify-otp', async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required.' });
    }

    try {
        // Find user by otp
        const user = await User.findOne({ otp });

        if (!user) {
            return res.status(404).json({ message: 'user not found.' });
        }

        // Check if OTP is valid
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // OTP is valid; clear OTP and expiration
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Send the uniqueId to the user's email or phone
        const messageContent = `Your Unique ID is: ${user.uniqueId}`;
        if (user.email) {
            await transporter.sendMail({
                from: process.env.email,
                to: user.email,
                subject: 'Your Unique ID',
                text: messageContent,
            });
        }

        // Return success response
        res.status(200).json({ message: 'OTP verified successfully! Unique ID has been sent to your email/phone.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// GET route to retrieve data from Database
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

app.post('/api/store-interaction', async (req, res) => {
    const { userId, recipeId, itemId, recipeName, itemName, useCase, category, cuisine } = req.body;
  
    try {
      const interaction = new UserInteraction({
        userId,
        recipeId,
        itemId,
        recipeName,
        itemName,
        useCase,
        category,
        cuisine,
        timestamp: new Date(),
      });
  
      await interaction.save();
      res.status(200).json({ message: 'Interaction saved successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error saving interaction', error: err });
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

app.get('/api/pregnantwomen', async (req, res) => {
    try {
        const Data = await PregnantWomen.find();
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
