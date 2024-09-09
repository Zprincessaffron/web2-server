const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Saffron Usage AI!",
        options: [
            "1. Culinary Uses",
            "2. Beauty Uses",
            "3. Medicinal Uses",
            "4. Pregnancy Uses"
        ],
        instructions: "To get started, choose a category by entering its corresponding number."
    });
});

module.exports = router;
