const {DisTube} = require("distube")
const discordClient = require('../handlers/VariableHandler').client
const {SpotifyPlugin} = require("@distube/spotify");
const Discord = require('discord.js')
const utils = require('../modules/utils')
const {SoundCloudPlugin} = require("@distube/soundcloud");
const db = require('../modules/database')

discordClient.distube = new DisTube(discordClient, {
    leaveOnStop: true,
    leaveOnEmpty: true,
    emitNewSongOnly: true,
    updateYouTubeDL: false,
    ytdlOptions: {
        highWaterMark: 1 << 25,
        quality: 'highestaudio'
    },
    plugins: [
        new SpotifyPlugin(
            {
                emitEventsAfterFetching: true
            }
        ),
        new SoundCloudPlugin()
    ],
})


const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${
        queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
discordClient.distube


    .on("playSong", (queue, song) => {
            db.stats.addSong();
            queue.textChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Default)
                    .setTitle(`${utils.Icons.music} Playing Song`)
                    .addField('Song', song.name)
                    .addField("Duration", song.formattedDuration)
                    .addField('Requested by', `${song.user}`)
                    .addField('Status', status(queue))
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }
    )


    .on("addSong", (queue, song) => {
            queue.textChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Success)
                    .setTitle(`${utils.Icons.music} Added song`)
                    .addField('Song', song.name)
                    .addField("Duration", song.formattedDuration)
                    .addField('Requested by', `${song.user}`)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }
    )
    .on("addList", (queue, playlist) => {
            queue.textChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Default)
                    .setTitle(`${utils.Icons.music} Added playlist`)
                    .addField('Playlist', playlist.name)
                    .addField("Duration", playlist.formattedDuration)
                    .addField("Song count", playlist.songs.length.toString())
                    .addField('Requested by', `${playlist.user}`)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })

        }
    )
    .on("searchNoResult", (message, query) => message.channel.send("No result found for: " + query))
    .on("error", (channel, e) => {
        if ((e.toString()).includes("PlayError")) {
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} PlayError`)
                    .setDescription(`--> **Failed to play your song!** <--\n\nFor more information join our support server: [Click here](https://discord.com/invite/JRzWEGzSWq)`)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        } else {
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} An unknown error occurred`)
                    .setDescription(`**Join our support server to report this issue: [Click here](https://discord.com/invite/JRzWEGzSWq)**\n\n`)
                    .addField("Error Message", `\`\`\`${e.toString().slice(0, 1974).replace("DisTubeError", "")}\`\`\``)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
            console.error(e)
        }
    })
    .on("empty", queue => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Error)
                .setTitle(`${utils.Icons.music}${utils.Icons.error} Empty Channel`)
                .setDescription("It looks like the channel I am currently in has no more users. Since I don't want to play music alone, I will leave the channel now. :=)")
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })
    })
    .on("finish", queue => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Error)
                .setTitle(`${utils.Icons.music}${utils.Icons.error} Queue finished`)
                .setDescription("Your current queue has been terminated because there are no more songs in the queue. Add more songs/playlists to continue playing music.")
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })
    })
