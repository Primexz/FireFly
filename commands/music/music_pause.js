const Discord = require('discord.js');
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_pause',
    permissions: [],

    async execute(client, interaction) {

        utils.musicQueueEmptyCheck(client, interaction)


        if (queue.paused) {
            queue.resume()

            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Success)
                    .setTitle(`${utils.Icons.play} Resumed`)
                    .setDescription("Successfully resumed current queue!")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }

        queue.pause()

        return interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Success)
                .setTitle(`${utils.Icons.pause} Paused`)
                .setDescription("Successfully paused current queue!")
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })
    },
};