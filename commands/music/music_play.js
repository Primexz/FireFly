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


        if (utils.usrNoVoice(interaction))
            return


        var a;

        await interaction.deferReply();

        const {skip, unshift} = Object.assign({skip: false, unshift: false});

        const textChannel = interaction.channel;
        const member = interaction.member;
        const voiceChannel = interaction.member.voice.channel;
        await client.distube.playVoiceChannel(voiceChannel, songUrl, {
            member,
            textChannel,
            skip,
            a,
            unshift
        });

        await interaction.editReply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Loading Music-Player..`)
            ]
        })


    },
};