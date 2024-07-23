import { jobSearch } from "./jobSearch.js";
import { sessionsData } from "./botListener.js";


export async function handleButtons(interaction, client) {
    try {
        switch (interaction.customId) {
            case 'findJobButton':
                await interaction.reply({content: `Let's start searching for a perfect job...`});
                return jobSearch(interaction, client);
            case 'helpcv':
                return interaction.reply({
                    content: 'This feature is not implemented yet, but stay tuned!',
                });
            case 'toggleEnglishMode':
                // toggle the language mode
                sessionsData[interaction.user.id].isEnglish = !sessionsData[interaction.user.id].isEnglish;

                return interaction.reply({
                    content: sessionsData[interaction.user.id].isEnglish
                        ? 'Ok, now I will search only for opportunities in **English**.'
                        : 'Ok, now I will search for opportunities in **all languages**.'
                });
            case 'next-button':
                return interaction.channel.send({content: 'Ok, showing more opportunities'});
            default:
                return interaction.channel.send({content: 'Unknown command', ephemeral: true});
        }
    }
    catch (error) {
        console.error(error);
    }
}