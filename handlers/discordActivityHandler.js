const Discord = require('discord.js')
const fs = require('fs')
const utils = require("../modules/utils");
const discordClient = require("../handlers/VariableHandler").client;
const db = require('../modules/database')

module.exports = async (client) => {

    const Stats = [
        {type: "WATCHING", text: "{guildCount} server"},
        {type: "WATCHING", text: "{userCount} user"},
        {type: "LISTENING", text: "{streamCount} voice streams"},
        {type: "PLAYING", text: "/help"},
    ]

    async function nextStatus() {
        let status = Stats[Math.floor(Math.random() * Stats.length)];

        const guildCount = (await client.shard.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)
        const userCount = (await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))).reduce((acc, memberCount) => acc + memberCount, 0);
        const voiceStreams = (await client.shard.fetchClientValues('voice.adapters.size')).reduce((acc, voiceCount) => acc + voiceCount, 0);

        const formattedStatus = status.text
            .replace(/{guildCount}/g, utils.formatInt(guildCount))
            .replace(/{streamCount}/g, utils.formatInt(voiceStreams))
            .replace(/{userCount}/g, utils.formatInt(userCount));
        client.user.setActivity(formattedStatus, {type: status.type});
    }

    //first run
    await nextStatus();

    setInterval(nextStatus, 120000);
}