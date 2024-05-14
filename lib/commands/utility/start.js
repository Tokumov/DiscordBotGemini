import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts conversation with bot by sending initial message');

async function execute(interaction) {
    const initMessage = "Hello there! 👋\n\nI am a **bot** from **UNICO.AI** that could help you find your dream job.\n\nHere is what I can do:";
    await interaction.reply(initMessage);

    const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
            .setCustomId('findjob')
            .setLabel('Find Job')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('helpcv')
            .setLabel('Help with CV (not implemented)')
            .setStyle(ButtonStyle.Secondary),
    );
    interaction.channel.send({components: [row]});
}

export { data, execute };