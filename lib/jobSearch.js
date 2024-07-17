import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './getOpportunitiesInfoFromText.js';
import { isTextInEnglish } from './utils.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { sessionsData } from "./botListener.js";
// import { handleButtons } from "./main.js";


const validOpportunity = (opportunity, usingEnglishMode) => {
    return !usingEnglishMode || (
        isTextInEnglish(opportunity.opportunityName) &&
        isTextInEnglish(opportunity.opportunityDescription.slice(0, 500))
    );
};


const respondWithOpportunities = async (text, outterInteraction, page) => {
    const limit = 100;
    const pageSize = 5;
    const filterLang = (o) => validOpportunity(o, sessionsData[outterInteraction.user.id]?.isEnglish);
    let opportunitiesHaveBeenShown = false;
    try {
        const res = await getOpportunitiesInfoFromText(text, limit, page);
        const opportunitiesByKeywords = res.opportunitiesByKeywords.filter(filterLang).slice(page * pageSize, (page + 1) * pageSize);
        const filterUnique = (o1) => opportunitiesByKeywords.findIndex((o2) => o1.opportunityName === o2.opportunityName) === -1;
        const opportunitiesByPositions = res.opportunitiesByPositions
            .filter(filterLang)
            .filter(filterUnique)
            .slice(page * pageSize, (page + 1) * pageSize);
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
        outterInteraction.channel.send(`Sorry, something went horribly wrong on our side :(`);
    }
    return opportunitiesHaveBeenShown;
};

export function jobSearch(outerInteraction, client) {
    outerInteraction.channel.send("Please tell me what are you into or send your **CV** in a pdf format");

    outerInteraction.client.on("messageCreate", async message => {
        if (message.author.bot) return;
        const usingEnglishMode = sessionsData[message.author.id]?.isEnglish;
        if (message.attachments.size > 0) { // PDF is sent
            const firstAttachment = message.attachments.first();
            if (!firstAttachment.name.endsWith(".pdf")) {
                await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                return;
            }
            await message.reply("You've sent a PDF file.");
            const cvText = await extractTextFromPDF(firstAttachment.url);
            await respondWithOpportunities(cvText, outterInteraction, usingEnglishMode, page);
        }
        else { // For every user's message
            await message.reply(`Searching for opportunities based on your message...`);

            let opportunitiesHaveBeenShown = false;
            let page = 1;

            sessionsData[message.author.id] = { currentPage: 0};

            const row = new ActionRowBuilder({
                components: [
                    new ButtonBuilder()
                        .setCustomId('next-button')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                ]
            });

            // Initial page of opportunities, when there is no Next button
            if (sessionsData[message.author.id].currentPage === 0) {
                opportunitiesHaveBeenShown = await respondWithOpportunities(message);
                console.log(`opportunitiesHaveBeenShown: ${opportunitiesHaveBeenShown}`);
                page += 1;
            }

            // Client to listen on buttons
            client.on('interactionCreate', async interaction => {
                console.log(`here`);
                if (!interaction.isButton() || interaction.customId != 'next-button') return; // Check if the interaction is a button press
                opportunitiesHaveBeenShown = await respondWithOpportunities(message);
                page += 1;
                if (opportunitiesHaveBeenShown === false) {
                    await outterInteraction.channel.send("No more opportunities to show");
                    page = 1;
                    return;
                }
                console.log('end of interactionCreate');

                if (opportunitiesHaveBeenShown) {
                    // await interaction.reply(initMessage);
                    console.log('have to show next button');
                    outterInteraction.channel.send({ components: [row] });
                }
                else {
                    await outterInteraction.channel.send("No more opportunities to show");
                    page = 1;
                    opportunitiesHaveBeenShown = false;
                }
            });

            if (opportunitiesHaveBeenShown) {
                // await interaction.reply(initMessage);
                console.log('have to show next button');
                outterInteraction.channel.send({ components: [row] });
            }
            else {
                await message.channel.send("No more opportunities to show");
                page = 1;
                opportunitiesHaveBeenShown = false;
            }

        }
    });
}