const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    slashCmdData: [
        new SlashCommandBuilder().setName('avatar').setDescription('Get avatar image & url from an user'),
        new SlashCommandBuilder().setName('pause').setDescription('Pause current song on your guild'),
        new SlashCommandBuilder()
            .setName('music')
            .setDescription('Manage all music features of FireFly')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('play')
                    .setDescription('Add song to music queue')
                    .addStringOption(option => option.setName('url').setDescription('Youtube, Spotify, SoundCloud URL of your song').setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('pause')
                    .setDescription('Pause your current queue'))
]
}