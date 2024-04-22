const pdf = require('pdf-parse');
const fetch = require('node-fetch');
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error; // Rethrow the error so it can be caught by the caller
  }
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  try {
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      if (attachment && attachment.name.endsWith('.pdf')) {
        const response = await fetch(attachment.url);
        const buffer = await response.buffer();

        const extractedText = await extractTextFromPDF(buffer);

        const truncationMessage = '\n...[Text truncated]';
        const maxMessageSize = 2000 - truncationMessage.length;
        const replyText = extractedText.length <= maxMessageSize
          ? extractedText
          : extractedText.substring(0, maxMessageSize) + truncationMessage;

        await message.reply(replyText);
      }
    }
  } catch (error) {
    console.error('An error occurred while processing a message:', error);
    await message.reply('Sorry, an error occurred while processing your request.');
  }
});
