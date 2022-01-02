const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_manager',
    permissions: [],

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return

        if(utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]


        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Manager`)
                .setDescription(`[${currentSong.name}](${currentSong.url})`)
                .setThumbnail(currentSong.thumbnail)
                .addField(":eye: Views", utils.formatInt(currentSong.views), true)
                .addField("👍 Likes", utils.formatInt(currentSong.likes), true)
                .addField("👎 Dislikes", utils.formatInt(await utils.getYtDislikes(currentSong.id)), true)
                .addField("Time", queue.formattedCurrentTime, true)
                .addField("Duration", currentSong.formattedDuration, true)
                .addField("Queue", `${queue.songs.length <= 1 ? "1 song" : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
                .addField("Volume", `${queue.volume}%`, true)
                .addField("Loop", queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "❌", true)
                .addField("Autoplay", `${queue.autoplay ? "✅" : "❌"}`, true)
                .addField("Bitrate", `${queue.voiceChannel.bitrate / 1000} kbps`)
                .addField("Filter", queue.filters.join(", ") || "❌", true)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
            components: [new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('music-mng_play')
                        .setLabel('Play')
                        .setEmoji('▶️')
                        .setStyle('PRIMARY')
                        .setDisabled(queue.playing),
                    new Discord.MessageButton()
                        .setCustomId('music-mng_pause')
                        .setLabel('Pause')
                        .setEmoji('⏸')
                        .setStyle('PRIMARY')
                        .setDisabled(queue.playing ? false : true)
                )
            ]
        })


    },
};