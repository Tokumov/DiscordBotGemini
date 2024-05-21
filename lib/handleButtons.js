import { jobSearch } from "./jobSearch.js";

export async function handleButtons(interaction, client) {
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
}