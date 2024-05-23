// Script to update discord slash commands 
// Run it once when needed to update commands i.e. adding new command
// Don't move scripts location in project directory (always run from projects root) 

import { REST, Routes, Collection } from "discord.js";
import dotenv from 'dotenv';
import * as commandsList from "./lib/commands/utility/index.js";

dotenv.config();

const clientCommands = new Collection();

for (const commandName in commandsList) {
    const command = commandsList[commandName];
    if ('data' in command && 'execute' in command) {
        clientCommands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${commandName} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_API_KEY);

(async () => {
	try {
		console.log(`Started refreshing ${clientCommands.size} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: Array.from(clientCommands.values()).map(command => command.data) },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();