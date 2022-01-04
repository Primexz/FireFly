const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'stats',
    permissions: [],

    async execute(client, interaction) {

        const ping = client.ws.ping
        const streams = `${client.distube.listenerCount()} / ${client.distube.getMaxListeners()}`
        const shards = client.options.shardCount

        console.log(ping)





    },
};