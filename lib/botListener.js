import { handleButtons, initOpenAI } from "./main.js";
import * as commandsList from "./commands/utility/allCommands.js";
import { ButtonStyle, Client, Collection, Events, GatewayIntentBits, Partials } from "discord.js";

export let sessionsData = new Map();

export async function listenToDiscordBot() {
    initOpenAI();

    // Creation of client and commands registration
    const client = new Client({
        intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel], // Needed to receive DMs
    });

    await client.login(process.env.DISCORD_API_KEY);

    const clientCommands = new Collection();

    for (const commandName in commandsList) {
        const command = commandsList[commandName];
        if ('data' in command && 'execute' in command) {
            clientCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
        }
    }

    client.on(Events.ClientReady, () => {
        console.log("Bot has been started!");
    });

    client.on(Events.MessageCreate, async message => {
        if (message.author.bot) return; // Ignore messages from bots
        if (sessionsData[message.author.id]?.hasStarted != undefined) return; // Ignore messages from users who have already started
        else await message.reply("Type **/start** to see more."); // paranoid else
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isButton())
        {
            await handleButtons(interaction, client, sessionsData);
        }
        else if (interaction.isCommand()) {
            console.log(`Received command: ${interaction.commandName}`);

            const command = clientCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, client, sessionsData);
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
                        // ephemeral: true
                    });
                }
            }
        }
    });
}
