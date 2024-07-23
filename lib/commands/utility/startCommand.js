import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {defaultSessionState, sessionsData} from "../../main.js";
import { initialRow, settingsRow } from "../../buttons.js";

async function execute(interaction) {
    const initMessage = `Hello there, **${interaction.user.username}** 👋\n\nI am a **bot** from **UNICO.AI** that could help you find your dream job.\n\nHere is what I can do:`;

    await interaction.reply({
        content: initMessage,
        components: [initialRow]
    });

    await interaction.channel.send({
        content: `Bot settings:`,
        components: [settingsRow]
    });
}

const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts conversation with bot by sending initial message. Resets your settings.');

export { data, execute };