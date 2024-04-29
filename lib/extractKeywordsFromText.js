export async function extractKeywordsFromText(text) {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Extract programming languages and soft skills from the following text output JSON:",
        },
        { role: "user", content: text },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Failed to extract keywords with OpenAI:', error);
    throw error;
  }
}
