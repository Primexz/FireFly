const Discord = require('discord.js')
const fs = require('fs')
const utils = require("../modules/utils");

module.exports = async (client) => {

    const Stats = [
        {type: "WATCHING", text: "{guildCount} server"},
        {type: "WATCHING", text: "{userCount} user"},
        {type: "LISTENING", text: "{streamCount} voice streams"},
        {type: "PLAYING", text: "/help"},
    ]

    async function nextStatus() {
        const redisClient = require("./VariableHandler").redisClient

        let status = Stats[Math.floor(Math.random() * Stats.length)];

        await redisClient?.hGetAll('statistics').then(async redisResult => {
            const formattedStatus = status.text
                .replace(/{guildCount}/g, utils.formatInt(redisResult.guilds || 'N/A'))
                .replace(/{streamCount}/g, utils.formatInt(redisResult.voiceStreams || 'N/A'))
                .replace(/{userCount}/g, utils.formatInt(redisResult.userCount || 'N/A'));
            client.user.setActivity(formattedStatus, {type: status.type});
        })
    }

    //first run
    await nextStatus();

    setInterval(nextStatus, 60000);
}
