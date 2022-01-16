const Discord = require('discord.js')
const fs = require('fs')
const db = require('../modules/database')
const utils = require('../modules/utils')

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



    const ignoredButtons = ["accept_tictactoe", "deny_tictactoe", utils.getEmoji(1), utils.getEmoji(2), utils.getEmoji(3), utils.getEmoji(4), utils.getEmoji(5), utils.getEmoji(6), utils.getEmoji(7), utils.getEmoji(8), utils.getEmoji(9),]

    //Button Interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        await db.stats.addButton()

        //Prevent Executing Buttons like tictactoe
        if (ignoredButtons.includes(interaction.customId))
            return;

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