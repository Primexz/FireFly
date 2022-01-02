const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_stop',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return

        if(utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)


        await queue.stop()

        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Success)
                .setTitle(`${utils.Icons.play} Stopped`)
                .setDescription("Successfully stopped current queue!")
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })

    },
};