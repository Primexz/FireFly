const Discord = require('discord.js')
const fs = require('fs')
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

        const commandName = interaction.commandName
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return console.log(`Invalid Slash Command executed: ${commandName}`)


        if (command.permissions) {
            const authorPerms = interaction.channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has(command.permissions)) {

                const emb = new Discord.MessageEmbed()
                emb.setTitle(":x: Error")
                emb.setColor(Utils.EmbedColors.Error)
                emb.setDescription(`**You are missing** the following **permissions**: \`\`${command.permissions.join(`\`\`, \`\``)}\`\``)
                emb.setFooter("Pepe Discord Bot", client.user.displayAvatarURL({dynamic: true}))
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