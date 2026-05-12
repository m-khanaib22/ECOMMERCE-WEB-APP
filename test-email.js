require('dotenv').config();
const sendEmail = require('./server/helper/email');

async function testEmail() {
    try {
        console.log("Starting email test...");
        await sendEmail({
            to: process.env.SMTP_USER,
            subject: 'Test Email from Node.js',
            html: '<h1>Test successful!</h1><p>If you see this, email sending is working.</p>',
        });
        console.log("Test finished successfully!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testEmail();
