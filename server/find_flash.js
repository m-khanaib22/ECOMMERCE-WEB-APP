require('dotenv').config();
const https = require('https');

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const models = JSON.parse(data).models;
        const flash = models.filter(m => m.name.includes('flash'));
        console.log("Flash models available:");
        flash.forEach(m => console.log(m.name));
    });
}).on('error', (err) => {
    console.error("Error:", err.message);
});
