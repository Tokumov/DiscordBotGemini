import {
  Client,
  GatewayIntentBits,
  Partials,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

import { listenToDiscordBot } from "./lib/index.js";

config();

listenToDiscordBot(); // doing nothing now

const MODEL = "gemini-pro";

// API keys 
const GEMINI_API = process.env.GEMINI_API;
const DISCORD_API = process.env.DISCORD_API;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Use environment variables for sensitive data

const client = new Client({
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel], // Needed to receive DMs
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase().startsWith("hi")) {
    message.reply("Hello, sure!");
    message.reply(
      "Please, send me the faculty and university where you’re studying.",
    );
  }
  if (message.content.toLowerCase().startsWith("i am")) {
    message.reply("Great");
    message.reply(
      "Are you interested in full-time, part-time job or an internship?",
    );
  }
  if (message.content.toLowerCase().startsWith("i can")) {
    message.reply(
      "Ok, I found quite a lot of options for you to choose from.To make it easier, could you please provide a little bit more of info? CV would be great.",
    );
  }
  if (message.attachments.size > 0) {
    message.reply(
      "Nice! Thank you. I see you might be interested in some frontend developer job.",
    );
    setTimeout(() => {
      message.reply(`Here are the key things I managed to extract from your CV:
      -> React development, 3 years
      -> Vue.js, 1 year
      -> Python, 2 years
      -> Algorithms
      -> PostgreSQL databases
      -> Machine Learning`);

      const applyButton1 = new ButtonBuilder()
        .setLabel("Apply Here")
        .setStyle(ButtonStyle.Link) // or ButtonStyle.Primary for a normal button
        .setURL("https://experts.ai/widgets/opportunity/ST411?orgId=314353");

      // Create an action row to hold the button
      const row1 = new ActionRowBuilder().addComponents(applyButton1);

      const applyButton2 = new ButtonBuilder()
        .setLabel("Apply Here")
        .setStyle(ButtonStyle.Link) // or ButtonStyle.Primary for a normal button
        .setURL("https://experts.ai/widgets/opportunity/ST555?orgId=314353");

      // Create an action row to hold the button
      const row2 = new ActionRowBuilder().addComponents(applyButton2);

      const applyButton3 = new ButtonBuilder()
        .setLabel("Apply Here")
        .setStyle(ButtonStyle.Link) // or ButtonStyle.Primary for a normal button
        .setURL("https://experts.ai/widgets/opportunity/ST316?orgId=314353");

      // Create an action row to hold the button
      const row3 = new ActionRowBuilder().addComponents(applyButton3);

      // Send the message with the button
      message.author.send({
        content: `Frontend Developer (TypeScript, React) 
        Company: Fitify Workouts
        Job types: full-time, part-time
        Fitify combines the experience of fitness coaches with the latest technology to enable millions of healthy lifestyle changes. We’re a fast-growing team based in Prague, expanding to NYC, with folks working remotely around the globe. We’re looking for people keen to work in a fast-paced, data-driven company and are eager to have a direct impact on people’s well-being. Our team comes from various`,
        components: [row1],
      });

      message.author.send({
        content: `Data Scientist Internship with React/JS Exposure
Type: Internship
Company: H2O.ai
We are committed to pushing the boundaries of technology by creating an innovative AI-powered platform using large language models (LLMs). As part of our ongoing efforts, we are looking for a Data Scientist Intern with expertise in data science and a strong interest or experience in React/JS development. In this role, you will have the unique opportunity to contribute to a cutting-edge project that combines the latest AI`,
        components: [row2],
      });

      message.author.send({
        content: `Vue.js-Nuxt | profík
        Type: Part-time
        Company: Quanti
Jsi zručný frontenďák, který se nebojí nových projektů a výzev? Pokud ano, staň se jedním z nás! Hledáme Vue.js-Nuxt developera do týmu pro projekt na zelené louce. Jedná se o relativně velký e-shop pro nadnárodní společnost, který poběží na headless backendu Adobe Commerce (Magento). O projektu PWA frontend plánujeme psát v Nuxt 3 s TypeScriptem, lokálně budeme používat Vite místo Webpacku a stylovat budeme v Sassu (s Bootstrapem). Backend, který poběží lokálně v Dockeru, bude pak frontendu vystavovat GraphQL API.`,
        components: [row3],
      });

      message.author.send({
        content: `If you are interested in a job, just click on it’s name, there is a link with more details.`,
      });

      message.author.send({
        content: `And if you want to see more jobs, just text me ;)`,
      });
    }, 1000);
  }
});

client.login(DISCORD_API);
