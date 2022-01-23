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
        
        Do you need help? Enter our Discord server: [Server](https://discord.gg/JRzWEGzSWq)

        :musical_note: **__Music__**
        > \`\`play\`\`, \`\`manager\`\`, \`\`filter\`\`, \`\`nowplaying\`\`, \`\`volume\`\`, \`\`queue\`\`
        
        ✨ **__Fun__**
         > \`\`ttt (TicTacToe)\`\`
        
        :bulb: **__Other__**
        > \`\`help\`\`, \`\`avatar\`\`, \`\`stats\`\`, \`\`shards\`\`
       
                `)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
            components: [
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel('Homepage')
                            .setURL("https://pepebot.info")
                            .setStyle('LINK'),
                        new Discord.MessageButton()
                            .setLabel('Invite FireFly')
                            .setURL("https://discord.gg")
                            .setStyle('LINK'),
                        new Discord.MessageButton()
                            .setLabel("Support Server")
                            .setURL("https://discord.gg/JRzWEGzSWq")
                            .setStyle("LINK"),
                        new Discord.MessageButton()
                            .setLabel("Vote")
                            .setURL("https://top.gg")
                            .setStyle("LINK")
                    ),
            ]
        })

    },
};