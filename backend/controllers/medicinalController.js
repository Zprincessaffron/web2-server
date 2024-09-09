const generateResponse = require('../utils/generateResponse');
const { medicinalDetailTemplate } = require('../utils/promptTemplates');

async function getMedicinalDetails(req, res) {
    try {
        const { input } = req.body;
        const prompt = medicinalDetailTemplate.replace("{input}", input);
        const responseText = await generateResponse(prompt);
        res.json({ details: responseText });
    } catch (error) {
        res.status(500).json({ detail: `Internal server error: ${error.message}` });
    }
}

module.exports = getMedicinalDetails;
