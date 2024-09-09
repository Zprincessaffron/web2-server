const generateResponse = require('../utils/generateResponse');
const { beautyDetailTemplate } = require('../utils/promptTemplates');

async function getBeautyDetails(req, res) {
    try {
        const { input } = req.body;
        const prompt = beautyDetailTemplate.replace("{input}", input);
        const responseText = await generateResponse(prompt);
        res.json({ details: responseText });
    } catch (error) {
        res.status(500).json({ detail: `Internal server error: ${error.message}` });
    }
}

module.exports = getBeautyDetails;
