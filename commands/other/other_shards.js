const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const os = require('os')
const {version} = require('../../package.json');
const discordJs = require('../../package.json').dependencies["discord.js"]
const db = require("../../modules/database")


module.exports = {

    name: 'shards',
    permissions: [],

    async execute(client, interaction) {


        const shardUptime = await client.shard.broadcastEval(client => client.uptime)
        const shardUser = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
        const shardGuilds = await client.shard.fetchClientValues('guilds.cache.size')


        await interaction.reply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.fire} FireFly Shards`)
                .setFooter({
                    text: `You are on shard: ${interaction.guild.shard.id}\nutils.Embeds.footerText`,
                    iconURL: client.user.displayAvatarURL({dynamic: true}),
                })
                .setTimestamp(new Date())],
        })


    },
};