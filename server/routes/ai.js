const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to convert image URL to GenerativePart
async function urlToGenerativePart(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const mimeType = response.headers['content-type'] || 'image/jpeg';
        return {
            inlineData: {
                data: Buffer.from(response.data).toString("base64"),
                mimeType
            },
        };
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

router.post('/generate-description', async (req, res) => {
    try {
        const { name, imageUrl } = req.body;

        if (!name) return res.status(400).json({ message: "Product name is required" });

        // Use the most stable flash model available from the list we found
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

        const prompt = `Act as a professional e-commerce copywriter. 
        Write a compelling, SEO-friendly product description for a product named "${name}". 
        ${imageUrl ? "I have provided an image of the product. Please use its visual features (color, shape, style, etc.) in your description." : ""}
        The description should be engaging and highlight the benefits of the product.
        Keep it to about 2-3 paragraphs. 
        Return ONLY the description text, no extra commentary or formatting tags like markdown headers.`;

        const parts = [prompt];
        if (imageUrl) {
            console.log("Fetching image for AI:", imageUrl);
            const imagePart = await urlToGenerativePart(imageUrl);
            if (imagePart) {
                parts.push(imagePart);
            } else {
                console.warn("Could not process image, generating from name only.");
            }
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error("AI returned empty response");

        res.status(200).json({ description: text });

    } catch (error) {
        console.error("AI Generation Error:", error);
        
        // Handle specific Gemini errors
        if (error.status === 429) {
            return res.status(429).json({ message: "AI limit reached. Please wait a minute and try again." });
        }

        res.status(500).json({ success: false, message: "Failed to generate description. " + error.message });
    }
});

module.exports = router;
