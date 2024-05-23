// Script to update discord slash commands 
// Run it once when needed to update commands i.e. adding new command
// Don't move scripts location in project directory (always run from projects root) 

import { REST, Routes } from "discord.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Define __dirname in ESM environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = [];
const foldersPath = path.join(__dirname, 'lib/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
    
        // Add a new item to collection of commands
        // Key as a command name
        // Value as exported modeule
        try {
            console.log(filePath);
            const command = await import(`file://${filePath}`);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        } catch (error) {
            console.error(`Error importing command ${file}:`, error);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_API_KEY);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();