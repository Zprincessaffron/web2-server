// const axios = require('axios');
// const OpenAI = require('openai');
// const dotenv = require('dotenv').config();
// const apiKey = process.env.NVIDIA_API_KEY;
// const openai = new OpenAI({
//   apiKey: apiKey,
//   baseURL: 'https://integrate.api.nvidia.com/v1',
// });


// async function generateResponse(prompt) {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "meta/llama3-8b-instruct",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//       top_p: 0.7,
//       max_tokens: 1024,
//       stream: false, // Set to true if you want streaming responses
//     });
    
//     // Process the response and handle streaming if enabled
//     if (completion && completion.choices && completion.choices[0]) {
//       return completion.choices[0].message.content;
//     } else {
//       throw new Error('Unexpected API response format');
//     }
//   } catch (error) {
//     throw new Error(`Error generating response: ${error.message}`);
//   }
// }


// module.exports = generateResponse;

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv').config();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

async function generateResponse(prompt) {
  try {
    // Generate content using Google Generative AI
    const result = await model.generateContent(prompt);
    
    // Process the response
    if (result && result.response && result.response.text) {
      return result.response.text(); // Return the generated text
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    throw new Error(`Error generating response: ${error.message}`);
  }
}

module.exports = generateResponse;
