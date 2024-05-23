import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './getOpportunitiesInfoFromText.js';
import { inEnglish } from './utils.js';

/**
 * @param {Opportunity} opportunity
 * @param {boolean} usingEnglishMode
 */
const validOpportunity = (opportunity, usingEnglishMode) => {
    return !usingEnglishMode || (
        inEnglish(opportunity.opportunityName) &&
        inEnglish(opportunity.opportunityDescription.slice(0, 500))
    );
};

/**
 * @param {string} text
 * @param {any} channel
 * @param {boolean} usingEnglishMode
 */
const respondWithOpportunities = async (text, channel, usingEnglishMode) => {
    const limit = usingEnglishMode ? 10 : 5;
    const filterLang = (o) => validOpportunity(o, usingEnglishMode);
    try {
        const res = await getOpportunitiesInfoFromText(text, limit);
        const opportunitiesByKeywords = res.opportunitiesByKeywords.filter(filterLang).slice(0, 5);
        const filterUnique = (o1) => opportunitiesByKeywords.findIndex((o2) => o1.opportunityName === o2.opportunityName) === -1;
        const opportunitiesByPositions = res.opportunitiesByPositions
            .filter(filterLang)
            .filter(filterUnique)
            .slice(0, 5);
        if (opportunitiesByKeywords.length > 0) {
            channel.send("Here is the opportunities by your skills");
        }
        for (const opportunity of opportunitiesByKeywords) {
            await channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n`);
        }
        if (opportunitiesByPositions.length > 0) {
            await channel.send("Here is the opportunities by your potential positions");
        }
        for (const opportunity of opportunitiesByPositions) {
            await channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n`);
        }
    } catch (err) {
        console.log(`Something went wrong\n${err}`);
        channel.send(`Sorry, something went horribly wrong on our side :(`);
    }
};

export function jobSearch(channel, client, sessionsData) {
    channel.send("Please tell me what are you into or send your **CV** in a pdf format");

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        const usingEnglishMode = sessionsData.englishUsers.has(message.author.id);
        if (message.attachments.size > 0) { // PDF is sent
            const firstAttachment = message.attachments.first();
            if (!firstAttachment.name.endsWith(".pdf")) {
                await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                return;
            }
            await message.reply("You've sent a PDF file.");
            const cvText = await extractTextFromPDF(firstAttachment.url);
            await respondWithOpportunities(cvText, message.channel, usingEnglishMode);
        } else { // For every user's message
            await message.reply(`You didn't send a file, so I will try searching based on what you have written ${usingEnglishMode}`);
            await respondWithOpportunities(message.content, message.channel, usingEnglishMode);
        }
    });
}