const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const rawCommands = require('./client-application/slashcmds').slashCmdData
require('dotenv').config();
const botToken = process.env.BOT_TOKEN

const commands = rawCommands.map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(botToken);

if(process.argv[2]) {

    rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.argv[2]), {body: commands})
        .then(() => console.log('Successfully registered application commands. (Guild)'))
        .catch(console.error)
}
else
{
    rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {body: commands})
        .then(() => console.log('Successfully registered application commands. (Public)'))
        .catch(console.error)
}