import {
    Client, GatewayIntentBits, Partials, ButtonBuilder, ActionRowBuilder, ButtonStyle,
} from "discord.js";

import { getOpportunitiesInfoFromText } from "./index.js";

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
    client.on("messageCreate", async (message) => {
        if (greetings) { // Initial message is sent
            message.channel.send("Hi there!");
            message.channel.send("Try sending list of interesting for you keywords");
            greetings = false;
        }
        else if (message.attachments.size > 0) { // PDF is sent

            const firstAttachment = message.attachments.first();

            if (firstAttachment.name.endsWith(".pdf")) {
                message.reply("You've sent a PDF file.");
            } else {
                message.reply("You've sent a file, but it's not a PDF. Please try a pdf");
            }
        }
        else if (!message.author.bot) { // For every user's message
            message.channel.send("Here are the opportunities with the keywords you provided:");

            try {
                (await getOpportunitiesInfoFromText(message.content)).forEach(opportunity => {
                    message.channel.send(`**${opportunity.opportunityName}**\n${opportunity.opportunityDescription.slice(0, 500)}\n${opportunity.opportunityExtLink}`);

                    // const row = new MessageActionRow()
                    //     .addComponents(
                    //         new MessageButton()
                    //             .setLabel('Link')
                    //             .setURL(opportunity.opportunityExtLink)
                    //             .setStyle('LINK')
                    //     );

                    // message.channel.send({ content: `**${opportunity.opportunityName}**\n${opportunity.opportunityDescription}`, components: [row] });

                }
                )
            }
            catch (e) {
                console.log("Something went wrong with getOpportunitiesInfoFromText...")
                message.channel.send("Sorry, something went horribly wrong on our side :(");
            }
        }
    });

    client.login(DISCORD_API);

    return client;
}