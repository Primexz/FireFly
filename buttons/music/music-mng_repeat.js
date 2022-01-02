const Utils = require("../../modules/utils.js");
const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");

const Permissions = Discord.Permissions.FLAGS

module.exports = {

    id: 'music-mng_repeat',

    async execute(client, interaction) {

        if(utils.usrNoVoice(interaction))
            return;

        if(utils.musicQueueEmptyCheck(client, interaction))
            return;

        const queue = client.distube.getQueue(interaction)

        //Repeat Modes
        //0 = DISABLED
        //1 = SONG
        ///2 = QUEUE

        //Calc next mode for disTube repeatMode
        var nextMode = queue.repeatMode
        nextMode = (queue.repeatMode < 2 && queue.repeatMode >= 0) ? nextMode += 1 : nextMode = 0

        queue.setRepeatMode(nextMode)

        utils.updateMusicMng(interaction,client);
        interaction.deferUpdate()


    },
};