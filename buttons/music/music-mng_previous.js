const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_previous',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return;

        if(utils.musicQueueEmptyCheck(client, interaction))
            return;

        const queue = client.distube.getQueue(interaction)

        if(queue.previousSongs.length < 1)
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} No Previous`)
                    .setDescription("There is no previous song in your queue.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })


            utils.updateMusicMng(interaction, client)
            client.distube.previous(interaction)

            interaction.deferUpdate()


    },
};