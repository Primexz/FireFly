const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_skip',

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return;

        if (utils.musicQueueEmptyCheck(client, interaction))
            return;

        const queue = client.distube.getQueue(interaction)

        if (queue.songs.length <= 1)
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} No Song`)
                    .setDescription("There is no song to skip in your queue.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })


        await client.distube.skip(interaction)

        utils.updateMusicMng(interaction, client);

        interaction.deferUpdate()


    },
};