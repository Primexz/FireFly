const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_nowplaying',
    permissions: [],

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return

        if (utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]


        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Now Playing`)
                .setThumbnail(currentSong.thumbnail)
                .addField("Song Name", currentSong.name)
                .addField("Duration", currentSong.formattedDuration)
                .addField("Artist", currentSong.uploader.name)
                .addField("URL", currentSong.url)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })

    },
};