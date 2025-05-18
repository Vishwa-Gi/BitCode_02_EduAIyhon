require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Verify Google Cloud credentials
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    process.exit(1);
}

if (!fs.existsSync(credentialsPath)) {
    console.error(`Credentials file not found at: ${credentialsPath}`);
    process.exit(1);
}

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Initialize speech client
let speechClient;
try {
    speechClient = new speech.SpeechClient();
    console.log('Speech client initialized successfully');
} catch (error) {
    console.error('Error initializing speech client:', error);
    process.exit(1);
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Convert speech to text
async function speechToText(audioBuffer) {
    console.log('Starting speech to text conversion...');
    const audio = {
        content: audioBuffer.toString('base64'),
    };
    const config = {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        model: 'default',
        useEnhanced: true,
        audioChannelCount: 1,
        enableAutomaticPunctuation: true
    };
    const request = {
        audio: audio,
        config: config,
    };

    try {
        const [response] = await speechClient.recognize(request);
        if (!response || !response.results || response.results.length === 0) {
            throw new Error('No speech detected in the audio');
        }
        const transcribedText = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log('Successfully transcribed text:', transcribedText);
        return transcribedText;
    } catch (error) {
        console.error('Error in speech to text conversion:', error);
        throw new Error('Failed to convert speech to text: ' + error.message);
    }
}

// Generate website from text using Gemini
async function generateWebsite(text) {
    try {
        console.log('Generating website from text:', text);
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a web development expert. Create a complete, modern website based on this description: ${text}
        Rules:
        1. Return a complete HTML file with embedded CSS and JavaScript
        2. Use modern design principles and a clean layout
        3. Make it fully responsive for all devices
        4. Include all necessary styles in <style> tag
        5. Include all JavaScript in <script> tag
        6. Use semantic HTML5 elements
        7. Add smooth animations and transitions
        8. Ensure the code is complete and ready to run
        9. Include proper meta tags and viewport settings
        10. Use modern CSS features like Flexbox or Grid
        11. Add comments in the code for better understanding
        12. Ensure all interactive elements work properly
        13. Include a header with navigation
        14. Add a footer with contact information
        15. Make sure all sections are properly styled and responsive`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedCode = response.text();
        
        console.log('Successfully generated website code, length:', generatedCode.length);
        
        if (!generatedCode || generatedCode.trim() === '') {
            throw new Error('Generated code is empty');
        }

        return generatedCode;
    } catch (error) {
        console.error('Error generating website:', error);
        throw new Error('Failed to generate website: ' + error.message);
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
app.post('/api/voice-to-text', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('No audio file received');
            return res.status(400).json({ error: 'No audio file provided' });
        }

        // Log file details for debugging
        console.log('Received audio file:', {
            mimetype: req.file.mimetype,
            size: req.file.size,
            originalname: req.file.originalname
        });

        if (req.file.size === 0) {
            console.error('Empty audio file received');
            return res.status(400).json({ error: 'Empty audio file received' });
        }

        // Step 1: Convert speech to text
        console.log('Step 1: Converting speech to text...');
        const text = await speechToText(req.file.buffer);
        
        if (!text || text.trim() === '') {
            throw new Error('No text was transcribed from the audio');
        }

        // Step 2: Generate website code from the text
        console.log('Step 2: Generating website code from text...');
        const websiteCode = await generateWebsite(text);

        if (!websiteCode || websiteCode.trim() === '') {
            throw new Error('No website code was generated');
        }

        // Step 3: Send both the transcribed text and generated code
        console.log('Step 3: Sending response to client...');
        res.json({
            text,
            website: websiteCode,
        });

    } catch (error) {
        console.error('Detailed error:', error);
        
        // Send more specific error messages
        if (error.message.includes('No speech detected')) {
            return res.status(400).json({ error: 'No speech detected in the audio. Please try speaking more clearly.' });
        } else if (error.message.includes('Invalid audio data')) {
            return res.status(400).json({ error: 'Invalid audio format. Please try recording again.' });
        } else if (error.message.includes('credentials')) {
            return res.status(500).json({ error: 'Google Cloud credentials error. Please check your configuration.' });
        } else {
            return res.status(500).json({ 
                error: 'Error processing request: ' + error.message,
                details: error.stack
            });
        }
    }
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Google Cloud credentials path: ${credentialsPath}`);
}); 