const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");
const {version} = require("../../package.json");
const Permissions = Discord.Permissions.FLAGS

module.exports = {


    name: 'help',
    permissions: [],

    async execute(client, interaction) {

        await interaction.reply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.fire} FireFly - Help`)
                .setDescription(`
        Here is a list of all important commands for FireFly.
        If you need details about a command, just enter the command in the chat to get more information.

        :musical_note: **__music__**
        > \`\`play\`\`, \`\`manager\`\`, \`\`filter\`\`, \`\`nowplaying\`\`, \`\`volume\`\`
        
        :bulb: **__other__**
        > \`\`help\`\`, \`\`avatar\`\`, \`\`stats\`\`
        

        __**Useful links**__
        [Homepage](https://xyz.de/) | [Invite Pepe](https://discord.gg) | [Support Server](https://discord.gg) | [Vote](https://top.gg)
                `)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })

    },
};