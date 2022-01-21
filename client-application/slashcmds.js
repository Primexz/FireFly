const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    slashCmdData: [
        new SlashCommandBuilder().setName('avatar').setDescription('Get avatar image & url from an user').addUserOption(option => option.setName("user").setDescription("User The user you want to get the avatar from").setRequired(true)),
        new SlashCommandBuilder().setName('stats').setDescription('Get statistics about FireFly'),
        new SlashCommandBuilder().setName('help').setDescription('Get information about all the commands of FireFly.'),
        new SlashCommandBuilder().setName("ttt").setDescription("Play TicTacToe with a teammate").addUserOption(option => option.setName("user").setDescription("The user you want to play against").setRequired(true)),
        new SlashCommandBuilder().setName("shards").setDescription("Get an overview of the current shards from FireFly."),
        new SlashCommandBuilder().setName("poker").setDescription("Create poker activity game!"),
        new SlashCommandBuilder()
            .setName('music')
            .setDescription('Manage all music features of FireFly')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('play')
                    .setDescription('Add song to music queue')
                    .addStringOption(option => option.setName('url').setDescription('YouTube, Spotify, SoundCloud URL, Search-Query of your song').setRequired(true))
                    .addBooleanOption(option => option.setName('force').setDescription('Force the added song to be played directly.').setRequired(false)))
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
            .addSubcommand(subcommand =>
                subcommand
                    .setName("volume")
                    .setDescription("Set the volume of the current song in percent")
                    .addIntegerOption(option => option.setName("percent").setDescription("Your new volume in percent").setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName("queue")
                    .setDescription("Get an overview of the songs that are currently added to the queue.")
                    .addIntegerOption(option => option.setName("page").setDescription("Page Count").setRequired(false)))
    ]
}