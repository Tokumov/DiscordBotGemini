import { config } from "dotenv";
import { listenToDiscordBot } from "./lib/main.js";

config();

await listenToDiscordBot();