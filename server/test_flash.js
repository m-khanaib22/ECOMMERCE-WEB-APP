require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testFlash() {
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error:", error.status, error.statusText);
        if (error.errorDetails) {
            console.error("Details:", JSON.stringify(error.errorDetails, null, 2));
        }
    }
}

testFlash();
