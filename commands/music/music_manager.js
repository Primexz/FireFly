const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS
const progressbar = require('string-progressbar');

module.exports = {

    name: 'music_manager',
    permissions: [],

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return

        if (utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]

        let percentage = queue.currentTime / currentSong.duration;
        let progress = Math.round((100 * percentage));
        const statusProgress = progressbar.splitBar(100, progress, 20)[0]

        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Manager`)
                .setDescription(`Here you can make all the important settings to the music. For more settings have a look at the subcommands of /music.\n[${currentSong.name}](${currentSong.url})`)
                .setThumbnail(currentSong.thumbnail)
                .addField(":eye: Views", utils.formatInt(currentSong.views), true)
                .addField("👍 Likes", utils.formatInt(currentSong.likes), true)
                .addField("👎 Dislikes", utils.formatInt(await utils.getYtDislikes(currentSong.id)), true)
                .addField("Time", queue.formattedCurrentTime, true)
                .addField("Duration", currentSong.formattedDuration, true)
                .addField("Queue", `${queue.songs.length <= 1 ? "1 song" : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
                .addField("Volume", `${queue.volume}%`, true)
                .addField("Loop", queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Song") : "❌", true)
                .addField("Autoplay", `${queue.autoplay ? "✅" : "❌"}`, true)
                .addField("Bitrate", `${queue.voiceChannel.bitrate / 1000} kbps`)
                .addField("Filter", queue.filters.join(", ") || "❌", true)
                .addField(`\u200b`, `**${queue.formattedCurrentTime}**  ${statusProgress}  **${currentSong.formattedDuration}**`)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
            components: [
                new Discord.MessageActionRow()
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
                            .setDisabled(queue.playing ? false : true),
                        new Discord.MessageButton()
                            .setCustomId("music-mng_stop")
                            .setLabel("Stop")
                            .setEmoji("⏹")
                            .setStyle("SECONDARY"),
                        new Discord.MessageButton()
                            .setCustomId("music-mng_previous")
                            .setLabel("Previous")
                            .setEmoji("⬅️")
                            .setStyle("PRIMARY"),

                        new Discord.MessageButton()
                            .setCustomId("music-mng_skip")
                            .setLabel("Skip")
                            .setEmoji("➡️")
                            .setStyle("PRIMARY")
                    ),
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId("music-mng_repeat")
                            .setLabel("Repeat")
                            .setEmoji("🔄")
                            .setStyle("PRIMARY"),
                        new Discord.MessageButton()
                            .setCustomId("music-mng_autoplay")
                            .setLabel("Autoplay")
                            .setEmoji("⏏️")
                            .setStyle(queue.autoplay ? "SUCCESS" : "DANGER"),
                        new Discord.MessageButton()
                            .setCustomId("music-mng_refresh")
                            .setLabel("Refresh")
                            .setEmoji("🔃")
                            .setStyle("PRIMARY"),

                    )


            ]
        })


    },
};