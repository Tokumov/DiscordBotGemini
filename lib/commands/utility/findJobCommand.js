import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {jobSearch} from "../../jobSearch.js";

async function execute(interaction, client) {

    await interaction.reply({content: `Let's start searching for a perfect job...`});
    return jobSearch(interaction, client);
}

const data = new SlashCommandBuilder()
    .setName('find')
    .setDescription('Starts job search, same as button');

export {data, execute};