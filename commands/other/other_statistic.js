const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const os = require('os')
const { version } = require('../../package.json');
const discordJs = require('../../package.json').dependencies["discord.js"]

module.exports = {

    name: 'stats',
    permissions: [],

    async execute(client, interaction) {

        const ping = client.ws.ping
        const voiceStreams = `${client.distube.listenerCount()} / ${client.distube.getMaxListeners()}`
        const shards = client.options.shardCount
        const guilds = client.guilds.cache.size
        const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        const uptime = utils.formatTimestamp(client.uptime)
        const cpuCount = os.cpus().length
        const cpuModel = os.cpus()[0].model
        const usedMemory = os.freemem() / (1024 * 1024 * 1024)
        const totalMemory = os.totalmem() / (1024 * 1024 * 1024)
        const memoryPercent = `${((os.freemem() / os.totalmem()) * 100).toFixed(2)}%`

        const time1 = new Date()
        await interaction.reply("Collecting information..")
        const time2 = new Date()

        const responseTime = time2-time1

        await interaction.editReply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`FireFly Statistics`)
                .addField("Version", `\`\`\`FireFly:    ${version}\nDiscord.js: ${discordJs}\`\`\``, true)
                .addField("CPU Info", `\`\`\`${cpuCount} cores\n${cpuModel}\`\`\``, true)
                .addField("Memory Usage", `\`\`\`${usedMemory.toFixed(2)} / ${totalMemory.toFixed(2)} GB\n${memoryPercent}\`\`\``, true)
                .addField("Uptime", `\`\`\`${uptime}\`\`\``)
                .addField("Websocket Ping", `\`\`\`${ping}ms\`\`\``, true)
                .addField("Response Ping", `\`\`\`${responseTime}ms\`\`\``, true)
                .addField("Voice Streams", `\`\`\`${voiceStreams}\`\`\``, true)


                .addField("User", `\`\`\`${userCount}\`\`\``, true)
                .addField("Server", `\`\`\`${guilds}\`\`\``, true)
                .addField("Shards", `\`\`\`${shards}\`\`\``, true)

                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })


    },
};