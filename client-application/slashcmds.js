const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    slashCmdData: [
        new SlashCommandBuilder().setName('avatar').setDescription('Get avatar image & url from an user'),
        new SlashCommandBuilder().setName('music').setDescription('Play music'),
        new SlashCommandBuilder().setName('pause').setDescription('Pause current song on your guild'),
    ]
}