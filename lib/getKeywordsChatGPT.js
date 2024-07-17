import { OpenAI } from 'openai';

let openai;

function initOpenAI() {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

async function getKeywordsChatGPT(text) {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Extract top 5 technologies names and top 5 positions(like software engineer,java developer and etc) keywords from the following text and output JSON in a form { keywords: [...], positions: [...] }:",
                },
                { role: "user", content: text },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content);
        console.log(`Results from ChatGPT: ${result}`);
        return result;

    } catch (error) {
        console.error('Failed to extract keywords with OpenAI:', error);
        throw error;
    }
}

export { getKeywordsChatGPT, initOpenAI };