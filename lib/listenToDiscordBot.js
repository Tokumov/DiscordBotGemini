import { Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Partials } from "discord.js";
import { jobSearch, getOpportunitiesInfoFromText, initOpenAI, handleButtons } from "./index.js";
import { extractTextFromPDF } from "./CVParser.cjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ESM environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

    // Client to listen for the commands
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

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
    
    // Client to listen on buttons
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return; // Check if the interaction is a button press
    
        // Handle different button presses using interaction.customId
        handleButtons(interaction, client);
    });

    client.on("ready", () => {
        console.log("Bot has been started!");
    });

    client.login(process.env.DISCORD_API_KEY);

    return client;
}
