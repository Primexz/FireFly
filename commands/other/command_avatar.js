const Discord = require('discord.js');
const utils = require("../../modules/utils");
const {client: discordClient} = require("../../handlers/VariableHandler");
const Permissions = Discord.Permissions.FLAGS

module.exports = {


    name: 'avatar',
    permissions: [],

    async execute(client, interaction) {

        let user;
        try {
            user = await interaction.guild.members.fetch(interaction.options.getUser("user"))
        }
        catch {
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} User not found`)
                    .setDescription("This user don't exist on your guild!")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
        }

        let avatar = user.user.displayAvatarURL({ dynamic: true });
        if (!avatar.endsWith('?size=2048')) avatar += "?size=2048";

        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                .addField("URL", `[Avatar URL](${user.user.displayAvatarURL({ dynamic: true })})`)
                .setTitle(`👤 Avatar`)
                .setImage(avatar)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })

    },
};