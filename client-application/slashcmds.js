const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    slashCmdData: [
        new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    ]
}