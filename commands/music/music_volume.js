const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_volume',
    permissions: [],

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return

        if (utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]
        const oldVolume = queue.volume
        const newVolume = interaction.options.getInteger('percent')

        queue.setVolume(newVolume)

        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Volume Change`)
                .setDescription("The volume of the current queue has been changed.")
                .setThumbnail(currentSong.thumbnail)
                .addField("Old Volume", `${oldVolume}%`)
                .addField("New Volume", `${newVolume}%`)
                .addField("Requested by", `<@${interaction.user.id}>`)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })



    },
};