const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_refresh',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return;

        if(utils.musicQueueEmptyCheck(client, interaction))
            return;


        utils.updateMusicMng(interaction,client);
        interaction.deferUpdate()
    },
};