import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { sessionsData } from "../../main.js";
async function execute(interaction) {
    const initMessage = "Hello there! 👋\n\nI am a **bot** from **UNICO.AI** that could help you find your dream job.\n\nHere is what I can do:";
    await interaction.reply(initMessage);

    const initialRow = new ActionRowBuilder({
        components: [
            new ButtonBuilder()
                .setCustomId('findJobButton')
                .setLabel('Find Job')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('helpcv')
                .setLabel('Help with CV (coming soon)')
                .setStyle(ButtonStyle.Secondary)
        ]
    });

    const usingEnglishMode = false;
    // initial value after started:
    sessionsData[interaction.user.id] = { isEnglish: false, currentPage: 1, hasStarted: true };
    const settingsRow = new ActionRowBuilder({
        components: [
            new ButtonBuilder()
                .setCustomId('toggleEnglishMode')
                .setLabel(usingEnglishMode
                    ? 'Press to show opportunities in all languages'
                    : 'Press to show opportunities only in English'
                )
                .setStyle(ButtonStyle.Secondary)
        ]
    });

    interaction.channel.send({ components: [initialRow] });
    interaction.channel.send("\nBot settings:");
    interaction.channel.send({ components: [settingsRow] });
}

const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('Starts conversation with bot by sending initial message. Resets your settings.');

export { data, execute };