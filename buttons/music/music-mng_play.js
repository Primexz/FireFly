const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_play',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return;

        if(utils.musicQueueEmptyCheck(client, interaction))
            return;

        const queue = client.distube.getQueue(interaction)

        if (queue.paused) {
            queue.resume()

            interaction.reply({
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


            utils.updateMusicMng(interaction, client);
        } else {
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} Not Paused`)
                    .setDescription("The music was not stopped, so it cannot be continued.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }
    },
};