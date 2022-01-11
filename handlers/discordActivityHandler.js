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
        const formattedStatus = status.text
            .replace(/{guildCount}/g, utils.formatInt(client.guilds.cache.size))
            .replace(/{streamCount}/g, utils.formatInt(client.voice.adapters.size))
            .replace(/{userCount}/g, utils.formatInt(client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)));
        client.user.setActivity(formattedStatus, {type: status.type});
    }

    //first run
    await nextStatus();

    setInterval(nextStatus, 120000);
}