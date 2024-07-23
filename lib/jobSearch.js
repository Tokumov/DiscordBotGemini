import { extractTextFromPDF } from './CVParser.cjs';
import { getOpportunitiesInfoFromText } from './getOpportunitiesInfoFromText.js';
import { shorten, validOpportunity } from './utils.js';
import { ActionRowBuilder, Events, ButtonBuilder, ButtonStyle } from "discord.js";
import { sessionsData } from "./botListener.js";
import { nextButtonRow } from "./buttons.js";


function filterUnique(opportunitiesByKeywords) {
    const filterUnique = (o1) => opportunitiesByKeywords.findIndex((o2) => o1.opportunityName === o2.opportunityName) === -1;
}

function filterLanguage(opportunitiesByKeywords, message) {
    return opportunitiesByKeywords.filter((o) => validOpportunity(o, sessionsData[message.author.id]?.isEnglish));
}

// async function displayPageOfOpportunities (text, message) {
//     const LIMIT = 100;
//
//     let opportunitiesHaveBeenShown = false;
//     let opportunitiesByKeywords = [];
//     let keywords = [];
//
//     try {
//         let iteration = 0;
//
//         while (opportunitiesByKeywords.length !== 5) {
//             opportunitiesByKeywords, keywords = await getOpportunitiesInfoFromText(text, LIMIT,
//                 sessionsData[message.author.id]?.currentPage + iteration++);
//
//             message.channel.send(`Searching for opportunities based on the following keywords:\n\n*${keywords.join(', ')}*`);
//
//             opportunitiesByKeywords = filterLanguage(opportunitiesByKeywords, message);
//             filterUnique(opportunitiesByKeywords);
//         }
//
//
//         let index = 1;
//         if (opportunitiesByKeywords.length === 5) {
//             message.channel.send("### Here are the opportunities by keywords found:");
//             for (const opportunity of opportunitiesByKeywords) {
//                 const row = new ActionRowBuilder({
//                     components: [
//                         new ButtonBuilder()
//                             .setLabel('LINK')
//                             .setURL(`https://experts.ai/widgets/opportunity/${opportunity.opportunityId}?orgId=${opportunity.organizationBaseDtos[0].organizationId}`)
//                             .setStyle(ButtonStyle.Link)
//                     ]});
//                 await message.channel.send({ components: [row],
//                     content: `## ${index++}. ${opportunity.opportunityName}\n${shorten(opportunity.opportunityDescription, 100)} ...\n`
//                 });
//             }
//         }
//
//         // check if there are no opportunities
//         if (opportunitiesByKeywords.length != 0) {
//             opportunitiesHaveBeenShown = true;
//         }
//     }
//     catch (err) {
//         console.log(`Something went wrong in RespondWithOpportunities: ${err}`);
//         message.channel.send(`Sorry, something went wrong on our side :(\nWe are working on it`);
//     }
//
//     return opportunitiesHaveBeenShown;
// };

export function jobSearch(outerInteraction, client) {
    if (sessionsData[outerInteraction.user.id].alreadyInSearch === true) return;
    else {
        sessionsData[outerInteraction.user.id].alreadyInSearch = true;
    }

    console.log(`New job search by user ${outerInteraction.user.username}`);
    outerInteraction.channel.send("Please tell me what are you into or send your **CV** in a pdf format");

    // Waiting for user's message
    outerInteraction.client.on(Events.MessageCreate, async message => {
        if (message.author.bot) return;

        try {
            let textOfMessage;
            const LIMIT = 10;

            let opportunitiesHaveBeenShown = false;

            sessionsData[message.author.id].currentPage = 1; // for every new search, reset the page

            if (message.attachments.size > 0) { // PDF is sent
                const firstAttachment = message.attachments.first();
                if (!firstAttachment.name.endsWith(".pdf")) {
                    await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                    return;
                }
                await message.reply("You've sent a *PDF* file.");
                textOfMessage = await extractTextFromPDF(firstAttachment.url);
            } else { // Regular prompt is sent
                textOfMessage = message.content;
            }

            let {opportunitiesByKeywords, keywords} = await getOpportunitiesInfoFromText(textOfMessage, LIMIT, 1);


            message.channel.send(`Searching for opportunities based on the following keywords:\n"*${keywords.join(', ')}*"`);

            opportunitiesByKeywords = filterLanguage(opportunitiesByKeywords, message);
            filterUnique(opportunitiesByKeywords);


            let opportunityNumber = 1;

            if (opportunitiesByKeywords.length > 0) {
                message.channel.send("### Here are the top opportunities by the keywords found:");
                for (const opportunity of opportunitiesByKeywords) {
                    const row = new ActionRowBuilder({
                        components: [
                            new ButtonBuilder()
                                .setLabel('LINK')
                                .setURL(`https://experts.ai/widgets/opportunity/${opportunity.opportunityId}?orgId=${opportunity.organizationBaseDtos[0].organizationId}`)
                                .setStyle(ButtonStyle.Link)
                        ]
                    });
                    await message.channel.send({
                        components: [row],
                        content: `## ${opportunityNumber++}. ${opportunity.opportunityName}\n${shorten(opportunity.opportunityDescription, 100)} ...\n`
                    });
                }
                await message.channel.send(`**That's it for now. If you want to see more opportunities, type new keywords or send your CV again.**`);
                return;
            } else {
                await message.channel.send("No opportunities found based on the keywords. Try again ;)");
                return;
            }
        }
        catch (err) {
            console.log(`Something went wrong in RespondWithOpportunities: ${err}`);
            message.channel.send(`Sorry, something went wrong on our side :(\nWe are working on it`);
        }

        sessionsData[outerInteraction.user.id].alreadyInSearch = false;

        // // Initial page of opportunities, when there is no Next button
        // if (sessionsData[message.author.id].currentPage === 1) {
        //     opportunitiesHaveBeenShown = await displayPageOfOpportunities(message.content, message);
        //     sessionsData[message.author.id].currentPage += 1;
        // }
        //
        // // next button
        // client.on(Events.InteractionCreate, async interaction => {
        //     if (!interaction.isButton() || interaction.customId != 'next-button') return;
        //     console.log(`next button pressed`);
        //     opportunitiesHaveBeenShown = await displayPageOfOpportunities(message.content, message);
        //
        //     if (opportunitiesHaveBeenShown === false) {
        //         await message.channel.send("No more opportunities to show");
        //         sessionsData[message.author.id].currentPage = 1;
        //         return;
        //     }
        //     else {
        //         message.channel.send({ components: [nextButtonRow] });
        //         sessionsData[message.author.id].currentPage += 1;
        //     }
        // });
        //
        // if (opportunitiesHaveBeenShown === false)
        //     return;
    });
}