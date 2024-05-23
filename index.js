import { config } from "dotenv";
import { listenToDiscordBot } from "./lib/index.js";

config();

await listenToDiscordBot();