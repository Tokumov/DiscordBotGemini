import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './index.js';

export async function jobSearch(channel, client) {
    channel.send("Please tell me what are you into or send your **CV** in a pdf format");
    client.on("messageCreate", async message => {
        if (message.attachments.size > 0) {
            const firstAttachment = message.attachments.first();

            if (!firstAttachment.name.endsWith(".pdf")) {
                await channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                return;
            }

            message.reply("You've sent a PDF file.");
            const cvText = await extractTextFromPDF(firstAttachment.url);
            message.reply("Here is the opportunities by your skills");
            const { opportunitiesByKeywords, opportunitiesByPositions } = await getOpportunitiesInfoFromText(cvText, 5);
            for (const opportunity of opportunitiesByKeywords) {
                message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
            }
            message.reply("Here is the opportunities by your potential positions");
            for (const opportunity of opportunitiesByPositions) {
                message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
            }
        } else if (!message.author.bot) { // For every user's message
            message.channel.send("Here are the opportunities with the keywords you provided:");
        
            try {
                for (const opportunity of await getOpportunitiesInfoFromText(message.content, 5)) {
                    message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
                }
            } catch (error) {
                console.log(`Something went wrong with getOpportunitiesInfoFromText...\n${error}`)
                message.channel.send(`Sorry, something went horribly wrong on our side :(`);
            }
        }
    });
}