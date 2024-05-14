import { Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Partials } from "discord.js";
import { getOpportunitiesInfoFromText, initOpenAI } from "./index.js";
import { extractTextFromPDF } from "./CVParser.cjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ESM environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

   // let greetings = true;
    // const defaultUrl = "https://fit.cvut.cz/en/cooperation/for-students/job-offers/partners-and-sponzors";

    // client.on("messageCreate", async (message) => {

    //     if (greetings) { // Initial message is sent
    //         const initMessage = "Hello there! 👋\n\nI am a **bot** from **UNICO.AI** that could help you find your dream job.\n\nHere is what I can do:";
    //         message.channel.send(initMessage);

    //         const row = new ActionRowBuilder()
    //             .addComponents(
    //             new ButtonBuilder()
    //                 .setCustomId('findjob')
    //                 .setLabel('Find Job')
    //                 .setStyle(ButtonStyle.Primary),
    //             new ButtonBuilder()
    //                 .setCustomId('helpcv')
    //                 .setLabel('Help with CV (not implemented)')
    //                 .setStyle(ButtonStyle.Secondary),
    //         );
    //         message.channel.send({components: [row]});
    //         greetings = false;
    //     } else if (message.attachments.size > 0) { // PDF is sent
    //         const firstAttachment = message.attachments.first();

    //         if (!firstAttachment.name.endsWith(".pdf")) {
    //             await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
    //             return;
    //         }

    //         message.reply("You've sent a PDF file.");
    //         const cvText = await extractTextFromPDF(firstAttachment.url);
    //         message.reply("Here is the opportunities by your skills");
    //         const { opportunitiesByKeywords, opportunitiesByPositions } = await getOpportunitiesInfoFromText(cvText, 5);
    //         for (const opportunity of opportunitiesByKeywords) {
    //             message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //         }
    //         message.reply("Here is the opportunities by your potential positions");
    //         for (const opportunity of opportunitiesByPositions) {
    //             message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //         }
    //     } else if (!message.author.bot) { // For every user's message
    //         message.channel.send("Here are the opportunities with the keywords you provided:");

    //         try {
    //             for (const opportunity of await getOpportunitiesInfoFromText(message.content, 5)) {
    //                 message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //             }
    //         } catch (e) {
    //             console.log(`Something went wrong with getOpportunitiesInfoFromText...\n${e}`)
    //             message.channel.send(`Sorry, something went horribly wrong on our side :(`);
    //         }
    //     }
    // });

function jobSearch(channel, client) {
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

export async function listenToDiscordBot() {

    initOpenAI();

    // Creation of client and commands registration
    const client = new Client({
        intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel], // Needed to receive DMs
    });
    client.commands = new Collection();

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
        
            // Add a new item to collection of commands
            // Key as a command name
            // Value as exported modeule
            try {
                // console.log(filePath);
                const command = await import(`file://${filePath}`);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            } catch (error) {
                console.error(`Error importing command ${file}:`, error);
            }
        }
    }

    client.once(Events.ClientReady, readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    // Client to listener for the commands
    client.on(Events.InteractionCreate, async interaction => {
        // console.log("Some interaction");
        if (!interaction.isChatInputCommand()) return;
        // console.log(interaction);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // --- КОСТЫЛЬ ДЛЯ ТЕСТА --- Нужно зарегестрировать комманды
    client.on("messageCreate", async message => {
        if (message.toString().toLowerCase() == "hi") {
            const command = message.client.commands.get("start");
            await command.execute(message);
        }
    });
    // --- УБРАТЬ ---
    
    // Client to listen on buttons
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return; // Check if the interaction is a button press
    
        // Handle different button presses using interaction.customId
        switch (interaction.customId) {
            case 'findjob':
                await interaction.reply({ content: 'Let\'s start searching for a perfect job...'});
                jobSearch(interaction.channel, client);
                break;
            case 'helpcv':
                await interaction.reply({ content: 'This feature is not implemented yet, but stay tuned!', ephemeral: true });
                break;
            default:
                await interaction.reply({ content: 'Unknown command', ephemeral: true });
                break;
        }
    });

    client.on("ready", () => {
        console.log("Bot has been started!");
    });


    // let greetings = true;
    // const defaultUrl = "https://fit.cvut.cz/en/cooperation/for-students/job-offers/partners-and-sponzors";

    // client.on("messageCreate", async (message) => {

    //     if (greetings) { // Initial message is sent
    //         const initMessage = "Hello there! 👋\n\nI am a **bot** from **UNICO.AI** that could help you find your dream job.\n\nHere is what I can do:";
    //         message.channel.send(initMessage);

    //         const row = new ActionRowBuilder()
    //             .addComponents(
    //             new ButtonBuilder()
    //                 .setCustomId('findjob')
    //                 .setLabel('Find Job')
    //                 .setStyle(ButtonStyle.Primary),
    //             new ButtonBuilder()
    //                 .setCustomId('helpcv')
    //                 .setLabel('Help with CV (not implemented)')
    //                 .setStyle(ButtonStyle.Secondary),
    //         );
    //         message.channel.send({components: [row]});
    //         greetings = false;
    //     } else if (message.attachments.size > 0) { // PDF is sent
    //         const firstAttachment = message.attachments.first();

    //         if (!firstAttachment.name.endsWith(".pdf")) {
    //             await message.channel.send("You've sent a file, but it's not a PDF. Please try a pdf");
    //             return;
    //         }

    //         message.reply("You've sent a PDF file.");
    //         const cvText = await extractTextFromPDF(firstAttachment.url);
    //         message.reply("Here is the opportunities by your skills");
    //         const { opportunitiesByKeywords, opportunitiesByPositions } = await getOpportunitiesInfoFromText(cvText, 5);
    //         for (const opportunity of opportunitiesByKeywords) {
    //             message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //         }
    //         message.reply("Here is the opportunities by your potential positions");
    //         for (const opportunity of opportunitiesByPositions) {
    //             message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //         }
    //     } else if (!message.author.bot) { // For every user's message
    //         message.channel.send("Here are the opportunities with the keywords you provided:");

    //         try {
    //             for (const opportunity of await getOpportunitiesInfoFromText(message.content, 5)) {
    //                 message.channel.send(`__**${opportunity.opportunityName}**__\n${opportunity.opportunityDescription.slice(0, 500)}\n*LINK*: ${opportunity.opportunityExtLink}\n\n`);
    //             }
    //         } catch (e) {
    //             console.log(`Something went wrong with getOpportunitiesInfoFromText...\n${e}`)
    //             message.channel.send(`Sorry, something went horribly wrong on our side :(`);
    //         }
    //     }
    // });
    

    client.login(process.env.DISCORD_API_KEY);

    return client;
}
