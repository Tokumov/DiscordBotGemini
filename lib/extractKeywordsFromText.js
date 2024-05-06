import { OpenAI } from 'openai';

let openai;

function initOpenAI() {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

async function extractKeywordsFromText(text) {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Extract top 5 technologies names and top 5 if exist positions(like software engineer,java developer and etc) keywords from the following text and output JSON in a form { keywords: [...] }:",
        },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    console.log(JSON.parse(response.choices[0].message.content));
    return JSON.parse(response.choices[0].message.content).keywords;
  } catch (error) {
    console.error('Failed to extract keywords with OpenAI:', error);
    throw error;
  }
}

export { extractKeywordsFromText, initOpenAI };
