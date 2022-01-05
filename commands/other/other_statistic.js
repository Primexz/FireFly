const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const os = require('os')


module.exports = {

    name: 'stats',
    permissions: [],

    async execute(client, interaction) {

        const ping = client.ws.ping
        const streams = `${client.distube.listenerCount()} / ${client.distube.getMaxListeners()}`
        const shards = client.options.shardCount
        const guilds = client.guilds.cache.size
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        const uptime = utils.formatTimestamp(client.uptime)
        const cpuCount = os.cpus().length
        const cpuModel = os.cpus()[0].model
        const usedMemory = os.freemem() / (1024 * 1024 * 1024)
        const totalMemory = os.totalmem() / (1024 * 1024 * 1024)
        const memoryPercent = `${((os.freemem() / os.totalmem()) * 100).toFixed(2)}%`


        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`FireFly Statistics`)
                .addField("CPU Info", `\`\`\`${cpuCount} cores\n${cpuModel}\`\`\``, true)
                .addField("Memory Usage", `\`\`\`${usedMemory.toFixed(2)} / ${totalMemory.toFixed(2)} GB\n${memoryPercent}\`\`\``, true)
                .addField("Uptime", `\`\`\`${uptime}\`\`\``)

                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })


    },
};