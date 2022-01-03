const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    slashCmdData: [
        new SlashCommandBuilder().setName('avatar').setDescription('Get avatar image & url from an user'),
        new SlashCommandBuilder()
            .setName('music')
            .setDescription('Manage all music features of FireFly')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('play')
                    .setDescription('Add song to music queue')
                    .addStringOption(option => option.setName('url').setDescription('YouTube, Spotify, SoundCloud URL, Search-Query of your song').setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('manager')
                    .setDescription('Manage your current queue'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName("filter")
                    .setDescription("Manage all music filters/effects"))
            .addSubcommand(subcommand =>
                subcommand
                    .setName("nowplaying")
                    .setDescription("Get information about the song that is currently playing."))
    ]
}