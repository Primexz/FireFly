const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_play',
    permissions: [],

    async execute(client, interaction) {

        const songUrl = interaction.options.getString('url')


        if(utils.usrNoVoice(interaction))
            return

        client.distube.playVoiceChannel(interaction.member.voice.channel, songUrl, {
            textChannel: interaction.channel,
            member: interaction.member
        })


    },
};