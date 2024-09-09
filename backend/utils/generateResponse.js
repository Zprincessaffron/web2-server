const axios = require('axios');
const OpenAI = require('openai');
const dotenv = require('dotenv').config();
const apiKey = process.env.NVIDIA_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});


async function generateResponse(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama3-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false, // Set to true if you want streaming responses
    });
    
    // Process the response and handle streaming if enabled
    if (completion && completion.choices && completion.choices[0]) {
      return completion.choices[0].message.content;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    throw new Error(`Error generating response: ${error.message}`);
  }
}


module.exports = generateResponse;
