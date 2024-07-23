import { config } from "dotenv";
import { listenToDiscordBot } from "./lib/main.js";

config({ path: import.meta.dirname + "/.env" });

await listenToDiscordBot();