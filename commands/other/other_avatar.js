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
            user = await interaction.guild.members.fetch(interaction.options.getUser('user'))
        }
        catch {
            return await interaction.reply({
                embeds:
                    [new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setColor(utils.EmbedColors.Error)
                        .setDescription('I was not able to fetch this user.')
                        .setFooter({
                            text: utils.Embeds.footerText,
                            iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                        })
                        .setTimestamp(new Date())]
            })
        }


        let avatar = user.user.displayAvatarURL({dynamic: true});
        if (!avatar.endsWith('?size=2048')) avatar += "?size=2048";

        interaction.reply({
            embeds:
                [new Discord.MessageEmbed()
                    .setImage(avatar)
                    .setURL(avatar).setTitle("👤 Avatar")
                    .setColor(utils.EmbedColors.Default)
                    .setAuthor({
                        url: user.user.displayAvatarURL({dynamic: true}),
                        name: user.user.username
                    })
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
        })

    },
};