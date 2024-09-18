const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const AmericanCuisine = require("./models/americanCuisine.js");
const ArabianCuisine = require("./models/arabianCuisine.js");
const AustralianCuisine = require("./models/australianCuisine.js");
const BeautyAndSkincare = require("./models/beautyandskincare.js");
const EuropeanCuisine = require("./models/europeanCuisine.js");
const IndianCuisine = require("./models/indianCuisine.js");
const JapaneseCuisine = require("./models/japaneseCuisine.js");
const MedicinalUsage = require("./models/medicinalUsage.js");
const culinaryRoutes = require("./routes/culinaryRoutes.js");
const beautyRoutes = require("./routes/beautyRoutes.js");
const medicinalRoutes = require("./routes/medicinalRoutes.js");
const PregnantWomen = require("./models/pregnantwomen.js");
const pregnancyRoutes = require("./routes/pregnancyRoutes.js");
const crypto = require("crypto"); // For generating OTP
const nodemailer = require("nodemailer"); // For sending emails
const twilio = require("twilio"); // For sending SMS
const { body, validationResult } = require("express-validator");
const env = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserInteraction = require("./models/userInteraction.js");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const app = express();
const PORT = process.env.PORT;

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const TwilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const TwilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(TwilioAccountSid, TwilioAuthToken);

// console.log(process.env.ACCOUNTSID , process.env.AUTHTOKEN);

// const allowedOrigins = ['https://web2-client-eosin.vercel.app'];
// http://localhost:5173
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight OPTIONS request for all routes

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("web-2 MongoDB connected"))
  .catch((err) => console.log(err));

// Second MongoDB connection using createConnection
const web1DB = mongoose.createConnection(process.env.WEB1_MONGOURI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

web1DB.on("connected", () => {
  console.log("web-1 MongoDB connected");
});

web1DB.on("error", (err) => {
  console.log(`web-1 MongoDB connection error: ${err}`);
});

app.use("/api/culinary", culinaryRoutes);
app.use("/api/beauty", beautyRoutes);
app.use("/api/medicinal", medicinalRoutes);
app.use("/api/pregnancy", pregnancyRoutes);

// GET route to retrieve data from
app.get("/test", (req, res) => {
  res.json("Hello World");
});

// Define the User model for the connection
const User = web1DB.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    purchasedSite: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
  })
);


// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Function to format phone numbers to E.164 format
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  // Ensure phone number is in E.164 format
  return phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
};

app.post("/api/register", async (req, res) => {
  const { name, contact, password, purchasedSite } = req.body;

  // Validate request data
  if (!name || !password || !purchasedSite || !contact) {
    return res.status(400).json({ message: "Name, password, purchased site, and contact are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email: contact.trim() }, { phone: contact.trim() }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone number already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID based on the name and current timestamp
    const uniqueId = `${name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;

    // Generate a 6-digit OTP and set expiration time (15 minutes)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 15 * 60 * 1000;

    // Create a new user object
    const newUser = new User({
      name,
      [/\S+@\S+\.\S+/.test(contact) ? 'email' : 'phone']: contact.trim(),
      password: hashedPassword,
      purchasedSite,
      uniqueId,
      otp,
      otpExpires,
    });

    // Save the user to the database before sending OTP
    await newUser.save();

    // Send OTP via Email or SMS
    if (/\S+@\S+\.\S+/.test(contact)) {
      await transporter.sendMail({
        from: "your-email@gmail.com",
        to: contact.trim(),
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 15 minutes.`,
      });
    } else {
      await client.messages.create({
        body: `Your OTP code is ${otp}. It will expire in 15 minutes.`,
        from: "+12565788545",
        to: formatPhoneNumber(contact.trim()),
      });
    }

    // Return success response with user data (excluding the password)
    res.status(201).json({
      message: "User registered successfully. OTP has been sent.",
      userData: {
        name: newUser.name,
        contact: newUser.email || newUser.phone,
        purchasedSite: newUser.purchasedSite,
        uniqueId: newUser.uniqueId,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error." });
  }
});



app.post("/api/verify-uniqueId", async (req, res) => {
  const { uniqueId } = req.body;

  if (!uniqueId) {
    return res.status(400).json({ message: "Unique ID is required" });
  }

  try {
    // Verify if uniqueId exists in the database
    const user = await User.findOne({ uniqueId });

    if (user) {
      // Return the user data along with a success message
      return res.status(200).json({
        message: "Unique ID is valid.",
        userData: {
          name: user.name,
          email: user.email,
          purchasedSite: user.purchasedSite,
          uniqueId: user.uniqueId,
        },
      });
    } else {
      return res.status(404).json({ message: "Unique ID not found." });
    }
  } catch (error) {
    console.error("Error verifying uniqueId:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// // Endpoint to verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required." });
  }

  try {
    // Find user by otp
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if OTP is valid
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // OTP is valid; clear OTP and expiration
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send the uniqueId to the user's email or phone
    const messageContent = `Your Unique ID is: ${user.uniqueId}`;

    if (user.email) {
      await transporter.sendMail({
        from: process.env.Email,
        to: user.email,
        subject: "Your Unique ID",
        text: messageContent,
      });
    } else if (user.phone) {
      await client.messages.create({
        body: messageContent,
        from: "+12565788545",
        to: formatPhoneNumber(user.phone),
      });
      console.log(`Unique ID sent to ${user.phone}`);
    }

    // Return success response
    res
      .status(200)
      .json({
        message:
          "OTP verified successfully! Unique ID has been sent to your email/phone.",
      });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET route to retrieve data from Database
app.get("/api/american-cuisine", async (req, res) => {
  try {
    const cuisineData = await AmericanCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/arabian-cuisine", async (req, res) => {
  try {
    const cuisineData = await ArabianCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/australian-cuisine", async (req, res) => {
  try {
    const cuisineData = await AustralianCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/european-cuisine", async (req, res) => {
  try {
    const cuisineData = await EuropeanCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/indian-cuisine", async (req, res) => {
  try {
    const cuisineData = await IndianCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.post("/api/store-interaction", async (req, res) => {
  const {
    userId,
    recipeId,
    itemId,
    recipeName,
    itemName,
    useCase,
    category,
    cuisine,
  } = req.body;

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
    res.status(200).json({ message: "Interaction saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving interaction", error: err });
  }
});

app.get("/api/japanese-cuisine", async (req, res) => {
  try {
    const cuisineData = await JapaneseCuisine.find();
    if (!cuisineData.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(cuisineData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/beautyandskincare", async (req, res) => {
  try {
    const Data = await BeautyAndSkincare.find();
    if (!Data.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(Data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/medicinalusage", async (req, res) => {
  try {
    const Data = await MedicinalUsage.find();
    if (!Data.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(Data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.get("/api/pregnantwomen", async (req, res) => {
  try {
    const Data = await PregnantWomen.find();
    if (!Data.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(Data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

//   app.post('/ask-gpt', async (req, res) => {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           model: 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: prompt }],
//           max_tokens: 100,
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const gptResponse = response.data.choices[0].message.content;
//       res.json({ response: gptResponse });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error interacting with GPT-3.5 Turbo" });
//     }
//   });

// Route to handle Generative AI requests

app.post("/ask-gemini", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Generate content using Google Generative AI
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interacting with Gemini API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
