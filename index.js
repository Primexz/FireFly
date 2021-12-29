const Discord = require('discord.js');
require('dotenv').config();
const BotToken = process.env.BOT_TOKEN
const db = require('better-sqlite3')('FireFly-DB.db');

const client = new Discord.Client({
    shards: 'auto', partials: ['CHANNEL'], intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING]
});

client.login(BotToken)