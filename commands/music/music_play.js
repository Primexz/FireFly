const Discord = require('discord.js');

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_play',
    permissions: [],

    async execute(client, interaction) {

        const songUrl = interaction.options.getString('url')

        client.distube.playVoiceChannel(interaction.member.voice.channel, songUrl, { textChannel: interaction.channel, member: interaction.member })
    },
};