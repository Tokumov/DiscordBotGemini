import { jobSearch } from "./jobSearch.js";

export async function handleButtons(interaction, client, sessionsData) {
    switch (interaction.customId) {
        case 'findJobButton':
            await interaction.reply({ content: `Let's start searching for a perfect job...` });
            return jobSearch(interaction, client, sessionsData);
        case 'helpcv':
            return interaction.reply({
                content: 'This feature is not implemented yet, but stay tuned!',
                // ephemeral: true
            });
        case 'toggleEnglishMode':
            const usingEnglishMode = sessionsData[interaction.user.id]?.isEnglish;
            if (usingEnglishMode === undefined) {
                sessionsData[interaction.user.id] = { isEnglish: false };
            }

            if (usingEnglishMode) {
                sessionsData[interaction.user.id].isEnglish = false;
            } else {
                sessionsData[interaction.user.id].isEnglish = true;
            }

            return interaction.reply({
                content: usingEnglishMode
                    ? 'Ok, now I will search for opportunities in **all languages**.'
                    : 'Ok, now I will search only for opportunities in **English**.',
                // ephemeral: true
            });
        case 'next-button':
            return interaction.reply({ content: 'Ok, showing more opportunities' });
        default:
            return interaction.reply({ content: 'Unknown command', ephemeral: true });
    }
}