const discord = require('discord.js');
require('dotenv').config();
const botToken = process.env.BOT_TOKEN
const varHandl = require("./handlers/VariableHandler")
const db = require('better-sqlite3')('FireFly-DB.sqlite');

//Create new DC Client and assign Flags
const client = new discord.Client({
    shards: 'auto', partials: ['CHANNEL'], intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILD_INVITES, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING]
});

//Set Client Variable
varHandl.set('client', client)

//Load EventHandler
require('./handlers/EventHandler').init(client)

//Load CommandHandler
require('./handlers/CommandHandler')(client)

//Load distubeHandler
require('./handlers/distubeHandler')

//Login with Token from env Variable
client.login(botToken)