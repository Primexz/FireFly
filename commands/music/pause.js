const Discord = require('discord.js');

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'pause',
    permissions: [],

    async execute(client, interaction) {
        client.distube.pause(interaction.guild)
    },
};