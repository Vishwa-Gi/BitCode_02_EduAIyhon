const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
                Definition/Overview of the topic

Key Concepts/Subtopics with brief explanations

Examples (if applicable)

Diagrams or visual representation prompts (if relevant)

Use-cases or real-world applications

Important formulas/code snippets (if applicable)

Summary or Quick Revision Points


    `
});


async function generateContent(prompt) {
    const result = await model.generateContent(prompt);

    console.log(result.response.text())

    return result.response.text();

}

module.exports = generateContent    