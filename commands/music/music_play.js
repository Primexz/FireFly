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


        let requiredVoicePerms = [Permissions.CONNECT, Permissions.SPEAK]
        let requiredPerms = ""
        await requiredVoicePerms.forEach(value => {
            requiredPerms += `${interaction.member.voice?.channel.permissionsFor(client.user).has(value) ? ":white_check_mark:" : ":x:"}  **${Object.keys(Discord.Permissions.FLAGS).find(key => Discord.Permissions.FLAGS[key] === value)}**\n`
        })

        if (!interaction.member.voice?.channel.permissionsFor(client.user).has(requiredVoicePerms))
            return await interaction.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} Missing Bot Permissions`)
                    .setDescription("I need the following voice-permissions to execute the command correctly.")
                    .addField("Required Permissions", requiredPerms)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })


        await interaction.deferReply()


        await discordClient.distube.play(interaction.member.voice?.channel, songUrl, {
            member: interaction.member,
            textChannel: interaction.channel,
            skip: forceSong
        });

        await interaction.editReply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Loading Music-Player..`)
            ]
        })
    },
};