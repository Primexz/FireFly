const Discord = require('discord.js');

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music',
    permissions: [],

    async execute(client, interaction) {
        client.distube.playVoiceChannel(interaction.member.voice.channel, "atemlos", { textChannel: interaction.channel, member: interaction.member })
    },
};