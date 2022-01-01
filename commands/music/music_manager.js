const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_manager',
    permissions: [],

    async execute(client, interaction) {

        utils.usrNoVoice(interaction);
        utils.musicQueueEmptyCheck(client, interaction)

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]


           // .addField("Volume", `${queue.volume}%`, true)
           // .addField("Autoplay", `${queue.autoplay ? "✅" : "❌"}`, true)
           // .addField("Loop", queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "This Song") : "❌", true)
           // .addField("Filter", queue.filters.join(", ") || "❌", true)


        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Manager`)
                .addField("Views", utils.formatInt(currentSong.views))
                .addField("Likes", utils.formatInt(currentSong.likes))
                .addField("Dislikes", utils.formatInt(await utils.getYtDislikes(currentSong.id)))

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
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId('music-mng_pause')
                        .setLabel('Pause')
                        .setEmoji('⏸')
                        .setStyle('PRIMARY')
                )
            ]
        })


    },
};