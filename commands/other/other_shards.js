const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const os = require('os')
const {version} = require('../../package.json');
const discordJs = require('../../package.json').dependencies["discord.js"]
const db = require("../../modules/database")

const padZeroTwo = (n) => ('' + n).padStart(2, '0');

const formatMs = (ms) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysMs = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysMs / (60 * 60 * 1000));
    const hoursMs = ms % (60 * 60 * 1000);
    const minutes = Math.round(hoursMs / (60 * 1000)); // Rounds up to minutes

    let output = '';

    if (days > 0) {
        output += days + ':';
    }

    output += (days > 0 ? padZeroTwo(hours) : hours) + ':';
    output += padZeroTwo(minutes);

    return output;
};

module.exports = {

    name: 'shards',
    permissions: [],

    async execute(client, interaction) {


        const shardUptime = await client.shard.fetchClientValues('uptime')
        const shardUser = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
        const shardMemory = await client.shard.broadcastEval(c => process
            .memoryUsage().heapUsed / 1024 / 1024)
        const shardGuilds = await client.shard.fetchClientValues('guilds.cache.size')
        const shardPing = await client.shard.fetchClientValues('ws.ping')

        let embedFields = []
        for(var i = 0; i < client.shard.count; i++){
            embedFields.push({
                name: `Shard [${i}]:`,
                value: `
                    **📶 Latency:** \`\`${shardPing[i]}ms\`\`
                    **⌚ Uptime:** \`\`${formatMs(shardUptime[i
                    ])}\`\` 
                    **👾 Resources**:
                     \u200b \u200b \u200b \u200b \u200b\u200b 🤖 RAM: \`\`${Math.round(shardMemory[i] * 100) / 100} MB\`\` 
                    **⏳ Size:**
                    \u200b \u200b \u200b \u200b \u200b\u200b 📁 Server: \`\`${shardGuilds[i]}\`\`
                     \u200b \u200b \u200b \u200b \u200b\u200b 👤 Members: \`\`${shardUser[i]}\`\`  
                `,
                inline: true
            })
        }

        await interaction.reply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.fire} FireFly Shards`)
                .setFields(embedFields)
                .setFooter({
                    text: `You are on shard: ${interaction.guild.shard.id}\n${utils.Embeds.footerText}`,
                    iconURL: client.user.displayAvatarURL({dynamic: true}),
                })
                .setTimestamp(new Date())],
        })


    },
};