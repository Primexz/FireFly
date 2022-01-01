const Discord = require('discord.js');

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music',
    permissions: [],

    async execute(client, interaction) {
        client.distube.playVoiceChannel(interaction.member.voice.channel, "https://open.spotify.com/track/0Z17Mfpa69QNWdu8z6AA9c?si=44bf7f2ba5ba4d0e", { textChannel: interaction.channel, member: interaction.member })
    },
};