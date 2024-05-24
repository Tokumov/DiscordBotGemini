import { handleButtons, initOpenAI } from "./index.js";
import * as commandsList from "./commands/utility/index.js";
import { ButtonStyle, Client, Collection, Events, GatewayIntentBits, Partials } from "discord.js";

export async function listenToDiscordBot() {
    initOpenAI();

    // Creation of client and commands registration
    const client = new Client({
        intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel], // Needed to receive DMs
    });

    await client.login(process.env.DISCORD_API_KEY);

    const clientCommands = new Collection();

    const sessionsData = {
        englishUsers: new Set(),
        page: 0
    };

    for (const commandName in commandsList) {
        const command = commandsList[commandName];
        if ('data' in command && 'execute' in command) {
            clientCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
        }
    }

    // Client to listen for the commands
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = clientCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction, sessionsData);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }
    });

    // Client to listen on buttons
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return; // Check if the interaction is a button press

        // Handle different button presses using interaction.customId
        await handleButtons(interaction, client, sessionsData);
    });

    client.on("ready", () => {
        console.log("Bot has been started!");
    });
}
