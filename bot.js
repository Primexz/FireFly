const discord = require('discord.js');
require('dotenv').config();
const botToken = process.env.BOT_TOKEN
const varHandl = require("./handlers/VariableHandler")
const dbManager = require("./modules/database")
const { rCache } = require('./modules/redisController')


//Create new DC Client and assign Flags
const client = new discord.Client({
    partials: ['CHANNEL'],
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS,  discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILD_INVITES,]
});

//Set Client Variable
varHandl.set('client', client)

//Load EventHandler
require('./handlers/EventHandler').init(client)

//Load distubeHandler
require('./handlers/distubeHandler')

//Load buttonHandler
require('./handlers/buttonHandler')(client)

//Load selectMenuHandler
require('./handlers/selectMenuHandler')(client)

//Prepare Database
dbManager.stats.prepareDB()

client.login(botToken).then(async () => {
    const redisClient = await new rCache().init()
    varHandl.set('redisClient', redisClient)

    //load commandHandler after redis is done
    require('./handlers/CommandHandler')(client)
})
