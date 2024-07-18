const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    };
};

const rest = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);

(async () => {
    try {
        console.log(`Refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: commands,
            }
        );

        console.log(`Reloaded ${data.length} application (/) commands.`);
    } catch (err) {
        console.error(err);
    };
})();