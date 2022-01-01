const Discord = require('discord.js')
const fs = require('fs')

module.exports = async (client) => {

    client.btnIntera = new Discord.Collection();

    const btninteraction = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
    for (const file of btninteraction) {
        const inti = require(`./buttons/${file}`);
        client.btnIntera.set(inti.id, inti);
    }



    //Button Interactions
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;


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