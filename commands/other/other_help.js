const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");
const {version} = require("../../package.json");
const Permissions = Discord.Permissions.FLAGS

module.exports = {


    name: 'help',
    permissions: [],

    async execute(client, interaction) {

        await interaction.editReply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.fire} FireFly - Help`)
                .setDescription(``)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
        })

    },
};