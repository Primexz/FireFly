const {DisTube} = require("distube")
const discordClient = require('../handlers/VariableHandler').client
const {SpotifyPlugin} = require("@distube/spotify");
const Discord = require('discord.js')
const utils = require('../modules/utils')

discordClient.distube = new DisTube(discordClient, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    updateYouTubeDL: false,
    plugins: [new SpotifyPlugin()],
})


const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${
        queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
discordClient.distube


    .on("playSong", (queue, song) => {
            queue.textChannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Default)
                    .setTitle(`${utils.Icons.music} Playing Song`)
                    .addField('Song', song.name)
                    .addField("Duration", song.formattedDuration)
                    .addField('Requested by', `${song.user}`)
                    .addField('Status', status(queue))
                    .setFooter("FireFly Bot", discordClient.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp(new Date())]
            })
        }
    )


    .on("addSong", (queue, song) =>
        queue.textChannel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        )
    )
    .on("addList", (queue, playlist) =>
        queue.textChannel.send(
            `Added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue\n${status(queue)}`
        )
    )
    .on("searchNoResult", (message, query) => message.channel.send("No result found for: " + query))
    .on("error", (channel, e) => {
        channel.send(`An error encountered: ${e.toString().slice(0, 1974)}`)
        console.error(e)
    })
    .on("empty", queue => queue.textChannel.send("Channel is empty. Leaving the channel"))
    .on("searchNoResult", message => message.channel.send(`${client.emotes.error} | No result found!`))
    .on("finish", queue => queue.textChannel.send("Finished!"))