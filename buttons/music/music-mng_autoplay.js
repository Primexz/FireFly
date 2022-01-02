const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_autoplay',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return

        if(utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)

        queue.toggleAutoplay()

        utils.updateMusicMng(interaction, client);

        interaction.deferUpdate()

    },
};