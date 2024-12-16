# Set up

1. As the bot is on Unico's gitlab, you have to ask collaborator to add you as a member to organization.

2. When you become a collaborator, clone the repository.

3. In the .env file, there are 2 pairs of keys: DISCORD_API_KEY and CLIENT_ID. And there are production and development versions of those. For local use, you need development, so uncomment these, and comment production ones. 

4. Then, run to deploy the commands (if there are some new ones) and run the bot

```bash
node deploy-commands.js && node index.js
```

5. After the deployment of commands in further runs you can just do
```bash
node index.js
```
6. **That’s it.** The bot has been started. 


The bot is currently hosted on [Bot-Hosting.net](https://bot-hosting.net/)