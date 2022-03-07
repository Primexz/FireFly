const Discord = require('discord.js')
const fs = require('fs')

module.exports = async (client) => {


    client.selectIntera = new Discord.Collection();
    const commandFolders = fs.readdirSync('./selects');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./selects/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../selects/${folder}/${file}`);
            client.selectIntera.set(command.id, command);
        }
    }
    console.log(`[FF-SMH] Loaded ${client.selectIntera.size} select menus`)



    //Button Interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;


        const interactionID = interaction.customId
        const command = client.selectIntera.get(interactionID)
            || client.selectIntera.find(cmd => cmd.aliases && cmd.aliases.includes(interactionID));
        if (!command)
            return console.log(`Invalid Select Interaction found: ${interactionID}`)



        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    })
}
