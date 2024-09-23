const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Please provide a text prompt' });
        }

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                responseType: 'arraybuffer'
            }
        );

        res.set('Content-Type', 'image/jpeg');
        res.send(response.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while generating the image' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});