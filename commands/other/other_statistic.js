const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const os = require('os')
const {version} = require('../../package.json');
const discordJs = require('../../package.json').dependencies["discord.js"]
const redisClient = require("../../handlers/VariableHandler").redisClient

module.exports = {

    name: 'stats',
    permissions: [],

    async execute(client, interaction) {
        const time1 = new Date()
        await interaction.reply("Collecting information..")
        const time2 = new Date()
        const responseTime = time2 - time1

        const ping = client.ws.ping
        const shards = client.options.shardCount;
        const uptime = utils.formatTimestamp(client.uptime)
        const cpuCount = os.cpus().length
        const cpuModel = os.cpus()[0].model
        const totalMemory = os.totalmem() / (1024 * 1024 * 1024)
        const usedMemory =(require('os').totalmem() - require('os').freemem()) / (1024 * 1024 * 1024)
        const memoryPercent = `${((os.freemem() / os.totalmem()) * 100).toFixed(2)}`

        const memoryEmoji = memoryPercent < 50 ? ":green_circle:" : (memoryPercent < 90 ? ":yellow_circle:" : ":red_circle:");

        await redisClient.hGetAll('statistics').then(async redisResult => {
            interaction.editReply({
                content: null,
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Default)
                    .setTitle(`${utils.Icons.fire} FireFly Statistics`)
                    .addField("👾 Version", `\`\`\`FireFly:    ${version}\nDiscord.js: ${discordJs}\`\`\``, true)
                    .addField("🤖 CPU Info", `\`\`\`${cpuCount} cores\n${cpuModel}\`\`\``, true)
                    .addField(`⏳ Memory Usage ${memoryEmoji}`, `\`\`\`${usedMemory.toFixed(2)} / ${totalMemory.toFixed(2)} GB\n${memoryPercent}%\`\`\``, true)
                    .addField("⌚️ Uptime", `\`\`\`${uptime}\`\`\``)
                    .addField("📶 Websocket Ping", `\`\`\`${utils.formatInt(ping)}ms\`\`\``, true)
                    .addField("📶 Response Ping", `\`\`\`${utils.formatInt(responseTime)}ms\`\`\``, true)
                    .addField("🔔 Voice Streams", `\`\`\`${redisResult.voiceStreams || 'N/A'}\`\`\``, true)
                    .addField("👤 User", `\`\`\`${utils.formatInt(redisResult.userCount || 'N/A')}\`\`\``, true)
                    .addField("📁 Server", `\`\`\`${utils.formatInt(redisResult.guilds || 'N/A')}\`\`\``, true)
                    .addField("🌐 Shards", `\`\`\`${shards}\`\`\``, true)
                    .addField("⌨️ Commands Used", `\`\`\`${redisResult.commands || 'N/A'}\`\`\``, true)
                    .addField("🎵 Songs played", `\`\`\`${redisResult.songs || 'N/A'}\`\`\``, true)
                    .addField("🖱️ Buttons clicked", `\`\`\`${redisResult.buttons || 'N/A'}\`\`\``, true)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: client.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())],
            })
        })
    },
};
