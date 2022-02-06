const Discord = require('discord.js')
const fs = require('fs')
const utils = require("../modules/utils");
const discordClient = require("../handlers/VariableHandler").client;
const db = require('../modules/database')

module.exports = async (client) => {

    console.log("Loading Commands..")

//Load All Commands
    client.commands = new Discord.Collection();
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
            console.log(`Loaded ${file} command!`)
        }
    }


//Handle SlashCommands
    client.on('interactionCreate', async interaction => {

        if (!interaction.isCommand()) return;

        if(interaction.channel.type === "DM")
            return interaction.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} No Interactions in DM`)
                    .setDescription(`
                    FireFly does not support interactions in the DM's.

                    Please use all Slash Command on a server/build.`)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })

        await db.stats.addCommand()

        const commandName = interaction.commandName
        const subCommand = interaction.options._subcommand ? interaction.options.getSubcommand() : null
        const commandFileName = subCommand ? `${commandName}_${subCommand}` : `${commandName}`


        const command = client.commands.get(commandFileName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandFileName));

        if (command.botRequiredPerms) {
            if (!interaction.channel.permissionsFor(client.user).has(command.botRequiredPerms)) {
                let requiredPerms = "";
                await command.botRequiredPerms.forEach(value => {
                    requiredPerms += `${interaction.channel.permissionsFor(client.user).has(value) ? ":white_check_mark:" : ":x:"}  **${Object.keys(Discord.Permissions.FLAGS).find(key => Discord.Permissions.FLAGS[key] === value)}**\n`
                })

                return await interaction.reply({
                    ephemeral: true,
                    embeds: [new Discord.MessageEmbed()
                        .setColor(utils.EmbedColors.Error)
                        .setTitle(`${utils.Icons.error} Missing Bot Permissions`)
                        .setDescription("I need the following permissions to execute the command correctly.")
                        .addField("Command", commandName, true)
                        .addField("Guild", interaction.guild.name, true)
                        .addField("Requester", `<@${interaction.member.id}>`, true)
                        .addField("Required Permissions", requiredPerms)
                        .setFooter({
                            text: utils.Embeds.footerText,
                            iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                        })
                        .setTimestamp(new Date())]
                })
            }
        }


        if (!command) {
            return await interaction.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} Invalid Command`)
                    .setDescription("You have executed a slash command that is not resolvable. Please contact the administrator.")
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })
            return console.log(`Invalid Slash Command executed: ${commandFileName}`)
        }


        if (command.permissions) {
            const authorPerms = await interaction.channel?.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has(command.permissions)) {

                const emb = new Discord.MessageEmbed()
                emb.setTitle(":x: Error")
                emb.setColor(utils.EmbedColors.Error)
                emb.setDescription(`**You are missing** the following **permissions**: \`\`${command.permissions.join(`\`\`, \`\``)}\`\``)
                emb.setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                })
                emb.setTimestamp(new Date())

                return interaction.reply({embeds: [emb], ephemeral: true});
            }
        }


        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }

    })
}