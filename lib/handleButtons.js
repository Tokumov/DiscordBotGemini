import { jobSearch } from "./jobSearch.js";

export async function handleButtons(interaction, client, sessionsData) {
    switch (interaction.customId) {
        case 'findjob':
            await interaction.reply({ content: 'Let\'s start searching for a perfect job...' });
            return jobSearch(interaction.channel, client, sessionsData);
        case 'helpcv':
            return interaction.reply({
                content: 'This feature is not implemented yet, but stay tuned!',
                ephemeral: true
            });
        case 'toggleEnglishMode':
            const usingEnglishMode = sessionsData.englishUsers.has(interaction.user.id);
            if (usingEnglishMode) {
                sessionsData.englishUsers.delete(interaction.user.id);
            } else {
                sessionsData.englishUsers.add(interaction.user.id);
            }
            return interaction.reply({
                content: usingEnglishMode
                    ? 'Ok, now I will search for opportunities in all languages.'
                    : 'Ok, now I will search only for opportunities in English.',
                ephemeral: true
            });
        default:
            return interaction.reply({ content: 'Unknown command', ephemeral: true });
    }
}