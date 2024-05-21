import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './index.js';

const respondWithOpportunities = async (text, channel) => {
    try {
        channel.send("Here is the opportunities by your skills");
        const { opportunitiesByKeywords, opportunitiesByPositions } = await getOpportunitiesInfoFromText(text, 5);
        for (const opportunity of opportunitiesByKeywords) {
            channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
        }
        channel.send("Here is the opportunities by your potential positions");
        for (const opportunity of opportunitiesByPositions) {
            channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
        }
    } catch (err) {
        console.log(`Something went wrong with getOpportunitiesInfoFromText...\n${err}`)
        channel.send(`Sorry, something went horribly wrong on our side :(`);
    }
}

export async function jobSearch(channel, client) {
    channel.send("Please tell me what are you into or send your **CV** in a pdf format");

    client.on("messageCreate", async (message) => {
        if (message.attachments.size > 0) { // PDF is sent
            const firstAttachment = message.attachments.first();

            if (!firstAttachment.name.endsWith(".pdf")) {
                await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                return;
            }

            message.reply("You've sent a PDF file.");
            const cvText = await extractTextFromPDF(firstAttachment.url);
            await respondWithOpportunities(cvText, message.channel);
            
        } else if (!message.author.bot) { // For every user's message
            console.log("You didn't send a file, so I will try searching based on what you have written")
            await respondWithOpportunities(message.content, message.channel);
        }
    });
}