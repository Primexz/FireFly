const Discord = require('discord.js')
const fs = require('fs')

module.exports = async (client) => {


    client.btnIntera = new Discord.Collection();
    const commandFolders = fs.readdirSync('./selects');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./selects/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../selects/${folder}/${file}`);
            client.btnIntera.set(command.id, command);
            console.log(`Loaded ${file} select interaction!`)
        }
    }



    //Button Interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;


        const interactionID = interaction.customId
        const command = client.btnIntera.get(interactionID)
            || client.btnIntera.find(cmd => cmd.aliases && cmd.aliases.includes(interactionID));
        if (!command)
            return console.log(`Invalid Select Interaction found: ${interactionID}`)



        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    })
}