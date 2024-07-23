import {ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const initialRow = new ActionRowBuilder({
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

export const nextButtonRow = new ActionRowBuilder({
    components: [
        new ButtonBuilder()
            .setCustomId('next-button')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
    ]
});

export const settingsRow = new ActionRowBuilder({
    components: [
        new ButtonBuilder()
            .setCustomId('toggleEnglishMode')
            .setLabel('Press to switch opportunities language')
            .setStyle(ButtonStyle.Secondary)
    ]
});