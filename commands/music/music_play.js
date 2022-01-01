const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_play',
    permissions: [],

    async execute(client, interaction) {

        const songUrl = interaction.options.getString('url')


        if (!interaction.member.voice.channel) {
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} No Voice`)
                    .setDescription("You are not in a voice channel at the moment. Enter a VoiceChannel or StageChannel to play music.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }

        client.distube.playVoiceChannel(interaction.member.voice.channel, songUrl, {
            textChannel: interaction.channel,
            member: interaction.member
        })


    },
};