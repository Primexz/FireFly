const Discord = require('discord.js');
const fetch = require('node-fetch');
const discordClient = require("../handlers/VariableHandler").client;


module.exports = {
    EmbedColors: {
        Default: "#0390fc",
        Error: "#f52c2c",
        Success: "#25de1f"
    },
    Icons: {
        music: "🎵 ",
        error: "❌ ",
        success: "✅ ",
        pause: "⏸️ ",
        play: "▶️ "
    },
    Embeds: {
        footerText: "FireFly Bot"
    },

    musicQueueEmptyCheck: function (client, interaction) {
        const queue = client.distube.getQueue(interaction)

        if (!queue) {
            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(this.EmbedColors.Error)
                    .setTitle(`${this.Icons.error} Queue empty`)
                    .setDescription("Your queue is currently empty!")
                    .setFooter({
                        text: this.Embeds.footerText,
                        iconURL: client.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
            return true;
        }
    },

    usrNoVoice: function (interaction) {
        if (!interaction.member.voice.channel) {
            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(this.EmbedColors.Error)
                    .setTitle(`${this.Icons.error} No Voice`)
                    .setDescription("You are not in a voice channel at the moment. Enter a VoiceChannel or StageChannel to play music.")
                    .setFooter({
                        text: this.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
            return true
        }
    },

    formatInt: function (int) {
        return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    getYtDislikes: async function (vidId) {
        return await fetch(
            `https://returnyoutubedislikeapi.com/votes?videoId=${vidId}`
        ).then((response) => {
            return response.json().then((json) => {
                if (json && !("traceId" in response)) {
                    const {dislikes} = json;
                    return dislikes
                }
            });
        });
    },

    updateMusicMng: async function (interaction, client) {
        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]


        interaction.message.edit({
            embeds: [new Discord.MessageEmbed()
                .setColor(this.EmbedColors.Default)
                .setTitle(`${this.Icons.music} Music Manager`)
                .setDescription(`Here you can make all the important settings to the music. For more settings have a look at the subcommands of /music.\n[${currentSong.name}](${currentSong.url})`)
                .setThumbnail(currentSong.thumbnail)
                .addField(":eye: Views", this.formatInt(currentSong.views), true)
                .addField("👍 Likes", this.formatInt(currentSong.likes), true)
                .addField("👎 Dislikes", this.formatInt(await this.getYtDislikes(currentSong.id)), true)
                .addField("Time", queue.formattedCurrentTime, true)
                .addField("Duration", currentSong.formattedDuration, true)
                .addField("Queue", `${queue.songs.length <= 1 ? "1 song" : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
                .addField("Volume", `${queue.volume}%`, true)
                .addField("Loop", queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Song") : "❌", true)
                .addField("Autoplay", `${queue.autoplay ? "✅" : "❌"}`, true)
                .addField("Bitrate", `${queue.voiceChannel.bitrate / 1000} kbps`)
                .addField("Filter", queue.filters.join(", ") || "❌", true)
                .setFooter({
                    text: this.Embeds.footerText,
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
                            .setStyle("PRIMARY"),
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
                            .setStyle("PRIMARY")
                    )
            ]
        })
    },
    formatTimestamp: function (ms) {
        let secs = ms / 1000
        const days = ~~(secs / 86400);
        secs -= days * 86400;
        const hours = ~~(secs / 3600);
        secs -= hours * 3600;
        const minutes = ~~(secs / 60);
        secs -= minutes * 60;
        let total = [];

        if (days > 0)
            total.push(~~days + " days");
        if (hours > 0)
            total.push(~~hours + " hrs")
        if (minutes > 0)
            total.push(~~minutes + " mins")
        if (secs > 0)
            total.push(~~secs + " secs")
        if ([~~days, ~~hours, ~~minutes, ~~secs].every(time => time == 0)) total.push("0 secs");
        return total.join(", ");
    },


}