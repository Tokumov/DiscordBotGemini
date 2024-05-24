import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './getOpportunitiesInfoFromText.js';
import { inEnglish } from './utils.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { handleButtons } from "./index.js";


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
const respondWithOpportunities = async (text, channel, usingEnglishMode, sessionsData) => {
    const limit = 100;
    const pageSize = 5;
    const filterLang = (o) => validOpportunity(o, usingEnglishMode);
    let opportunitiesHaveBeenShown = false;
    try {
        const res = await getOpportunitiesInfoFromText(text, limit);
        const opportunitiesByKeywords = res.opportunitiesByKeywords.filter(filterLang).slice(sessionsData.page * pageSize, (sessionsData.page + 1) * pageSize);
        const filterUnique = (o1) => opportunitiesByKeywords.findIndex((o2) => o1.opportunityName === o2.opportunityName) === -1;
        const opportunitiesByPositions = res.opportunitiesByPositions
            .filter(filterLang)
            .filter(filterUnique)
            .slice(sessionsData.page * pageSize, (sessionsData.page + 1) * pageSize);
        if (opportunitiesByKeywords.length > 0) {
            channel.send("Here are the opportunities by your skills");
        }
        for (const opportunity of opportunitiesByKeywords) {
            await channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n`);
        }
        if (opportunitiesByPositions.length > 0) {
            await channel.send("Here are the opportunities by your potential positions");
        }
        for (const opportunity of opportunitiesByPositions) {
            await channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n`);
        }

        // check if there are no opportunities
        if (opportunitiesByKeywords.length != 0 || opportunitiesByPositions.length != 0) {
            opportunitiesHaveBeenShown = true;
        }
    } catch (err) {
        console.log(`Something went wrong\n${err}`);
        channel.send(`Sorry, something went horribly wrong on our side :(`);
    }
    return opportunitiesHaveBeenShown;
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
            await respondWithOpportunities(cvText, message.channel, usingEnglishMode, sessionsData);
        } else { // For every user's message
            await message.reply(`You didn't send a file, so I will try searching based on what you have written ${usingEnglishMode}`);

            let opportunitiesHaveBeenShown = false;
            sessionsData.page = 0;
            const row = new ActionRowBuilder({
                components: [
                    new ButtonBuilder()
                        .setCustomId('next-button')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                ]
            });

            console.log(`message.content): ${message.content}`);
            console.log(`sessionsData.page: ${sessionsData.page}`);


            // Initial page of opportunities, when there is no Next button
            if (sessionsData.page === 0) {

                opportunitiesHaveBeenShown = await respondWithOpportunities(message.content, message.channel, usingEnglishMode, sessionsData);
                console.log(`opportunitiesHaveBeenShown: ${opportunitiesHaveBeenShown}`);
                sessionsData.page += 1;
            }

            // Client to listen on buttons
            client.on('interactionCreate', async interaction => {
                console.log(`here`);
                if (!interaction.isButton() || interaction.customId != 'next-button') return; // Check if the interaction is a button press
                opportunitiesHaveBeenShown = await respondWithOpportunities(message.content, message.channel, usingEnglishMode, sessionsData);
                sessionsData.page += 1;
                if (opportunitiesHaveBeenShown === false) {
                    await interaction.reply("No more opportunities to show");
                    sessionsData.page = 0;
                    return;
                }
                console.log('end of interactionCreate');

                if (opportunitiesHaveBeenShown) {
                    // await interaction.reply(initMessage);
                    console.log('have to show next button');
                    channel.send({ components: [row] });
                }
                else {
                    await message.reply("No more opportunities to show");
                    sessionsData.page = 0;
                    opportunitiesHaveBeenShown = false;
                }
            });

            if (opportunitiesHaveBeenShown) {
                // await interaction.reply(initMessage);
                console.log('have to show next button');
                channel.send({ components: [row] });
            }
            else {
                await message.reply("No more opportunities to show");
                sessionsData.page = 0;
                opportunitiesHaveBeenShown = false;
            }

        }
    });
}