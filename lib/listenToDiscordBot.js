import { Client, GatewayIntentBits, Partials } from "discord.js";
import { getOpportunitiesInfoFromText } from "./index.js";
import { extractTextFromPDF } from "./CVParser.cjs";

export function listenToDiscordBot() {
    const DISCORD_API = process.env.DISCORD_API;

    const client = new Client({
        intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel], // Needed to receive DMs
    });

    client.on("ready", () => {
        console.log("Bot has been started!");
    });

    let greetings = true;
    const defaultUrl = "https://fit.cvut.cz/en/cooperation/for-students/job-offers/partners-and-sponzors";

    client.on("messageCreate", async (message) => {
        if (greetings) { // Initial message is sent
            message.channel.send("Hi there!");
            message.channel.send("Try sending list of interesting for you keywords");
            greetings = false;
        } else if (message.attachments.size > 0) { // PDF is sent
            const firstAttachment = message.attachments.first();

            if (!firstAttachment.name.endsWith(".pdf")) {
                await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
                return;
            }

            message.reply("You've sent a PDF file.");
            const cvText = await extractTextFromPDF(firstAttachment.url);
            for (const opportunity of await getOpportunitiesInfoFromText(cvText, 5)) {
                message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
            }
        } else if (!message.author.bot) { // For every user's message
            message.channel.send("Here are the opportunities with the keywords you provided:");

            try {
                for (const opportunity of await getOpportunitiesInfoFromText(message.content, 5)) {
                    message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
                }
            } catch (e) {
                console.log(`Something went wrong with getOpportunitiesInfoFromText...\n${e}`)
                message.channel.send(`Sorry, something went horribly wrong on our side :(`);
            }
        }
    });

    client.login(DISCORD_API);

    return client;
}