const generateResponse = require('../utils/generateResponse');
const { pregnancyDetailTemplate } = require('../utils/promptTemplates');

async function getPregnancyDetails(req, res) {
    try {
        const { input } = req.body;
        const prompt = pregnancyDetailTemplate.replace("{input}", input);
        const responseText = await generateResponse(prompt);
        res.json({ details: responseText });
    } catch (error) {
        res.status(500).json({ detail: `Internal server error: ${error.message}` });
    }
}

module.exports = getPregnancyDetails;
