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

        if (!queue)
            return interaction.reply({
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
    },

    usrNoVoice: function (interaction) {
        if (!interaction.member.voice.channel) {
            return interaction.reply({
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
                    const { dislikes } = json;
                    return dislikes
                }
            });
        });
    }


}