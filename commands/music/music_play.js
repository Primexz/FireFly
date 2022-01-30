const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_play',
    permissions: [],
    botRequiredPerms: [
        Permissions.SEND_MESSAGES,
        Permissions.CONNECT,
        Permissions.SPEAK,
    ],

    async execute(client, interaction) {

        const songUrl = interaction.options.getString('url')
        const forceSong = interaction.options.getBoolean('force') || false


        if (utils.usrNoVoice(interaction))
            return



        await interaction.deferReply()

        await discordClient.distube.play(interaction.member.voice?.channel, songUrl, {
            member: interaction.member,
            textChannel: interaction.channel,
        });

        await interaction.editReply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Loading Music-Player..`)
            ]
        })


    },
};