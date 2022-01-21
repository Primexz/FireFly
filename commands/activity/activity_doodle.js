const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'doodle-crew',
    permissions: [],

    async execute(client, interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} No Voice`)
                    .setDescription("You are not in a voice channel at the moment. Enter a VoiceChannel to play games.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: client.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }

        let memberVoiceChannelId = interaction.member.voice?.channel;
        memberVoiceChannelId.createInvite({
            targetType: 2,
            targetApplication: utils.activityApplications.doodlecrew
        })
            .then(invite => {
                 interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(utils.EmbedColors.Default)
                        .setTitle(`🎮 Doodle Crew`)
                        .setDescription(`I have created the invite for the game: "Doodle-Crew".\nClick on the following link to join the game.\n\n--> **[Here](https://discord.gg/${invite.code})** <--`)
                        .setFooter({
                            text: `${utils.Embeds.footerText}`,
                            iconURL: client.user.displayAvatarURL({dynamic: true})
                        })
                        .setTimestamp(new Date())
                    ]
                })
            })
            .catch(console.error);

    },
};