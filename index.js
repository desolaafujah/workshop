const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const OpenAI = require('openai');
const client = new OpenAI();
const app = express();


// enable cors and json body parsing
app.use(cors());
app.use(express.json());


class ChatService {
    constructor() {
        if(!process.env.OPENAI_API_KEY) {
            throw new Error('openai api key not found');
        }

        const configuration = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.openai = new OpenAI(configuration);
    }

    async askChat(prompt){
        // change the prompt to be respond in english if
        // Respond in Spanish unless the user asks for a translation 
        if(!prompt) {
            throw new Error('Prompt is required');
        }
        if(prompt.length > 1000) {
            throw new Error('Prompt is too long');
        }
        const prompted = `
            Analyze the user input and respond in a friendly and engaging manner.
            Your response should be in Spanish unless the user asks for a translation.
            this is the user input: "${prompt}"
            Remember:
            1. First, analyze the user input to see if the user is asking for a translation or is confused, and then provide only in English, the tranlsation of the message you sent before the current user input
            2. Respond in English only if the user asks for a translation
            3. Be friendly and engaging
            4. Provide a translation of previous input if user asks for it
            `;

        try {
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a really cool Spanish tutor who would only respond in English if the user asks explicitly for a translation" },
                    {role: "user", content: prompted}
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            const insights = response.choices[0].message.content.trim();
            return insights;
        } catch(error) {
            console.error("Error with OpenAI API request:", error);
            throw error;
        }
    }

}

const chatService = new ChatService();

// /ask endpoint -> this is where the user input from the frontend is processed in the backend
 // and sent to chat
app.post('/ask', async(req, res) => {
    // initial error check
    if(!req.body || !req.body.prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const answer = await chatService.askChat(req.body.prompt);
        res.json({response:  answer});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'internal server error' });
    }
});


const port = 5000;

// starting the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})