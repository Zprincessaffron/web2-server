const generateResponse = require('../utils/generateResponse');
const { culinaryListTemplate, culinaryDetailTemplate } = require('../utils/promptTemplates');

async function getCulinaryRecommendations(req, res) {
    try {
        const prompt = culinaryListTemplate;
        const responseText = await generateResponse(prompt);
        const dishes = responseText.split('\n').filter(dish => dish.trim() !== "");
        res.json({ recommendations: dishes });
    } catch (error) {
        res.status(500).json({ detail: `Internal server error: ${error.message}` });
    }
}

async function getCulinaryDetails(req, res) {
    try {
        const { dish } = req.body;
        const prompt = culinaryDetailTemplate.replace("{dish}", dish);
        const responseText = await generateResponse(prompt);
        res.json({ details: responseText });
    } catch (error) {
        res.status(500).json({ detail: `Internal server error: ${error.message}` });
    }
}

module.exports = {
    getCulinaryRecommendations,
    getCulinaryDetails
};
