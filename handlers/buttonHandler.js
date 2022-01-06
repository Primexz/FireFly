const Discord = require('discord.js')
const fs = require('fs')
const db = require('../modules/database')

module.exports = async (client) => {


    client.btnIntera = new Discord.Collection();
    const commandFolders = fs.readdirSync('./buttons');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./buttons/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../buttons/${folder}/${file}`);
            client.btnIntera.set(command.id, command);
            console.log(`Loaded ${file} btn interaction!`)
        }
    }



    //Button Interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        await db.stats.addButton()

        const interactionID = interaction.customId
        const command = client.btnIntera.get(interactionID)
            || client.btnIntera.find(cmd => cmd.aliases && cmd.aliases.includes(interactionID));
        if (!command)
            return console.log(`Invalid Button Interaction found: ${interactionID}`)



        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
        }
    })
}