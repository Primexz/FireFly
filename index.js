const { ShardingManager } = require('discord.js');
require('dotenv').config();
const botToken = process.env.BOT_TOKEN


const manager = new ShardingManager('./bot.js', { token: botToken });

manager.on('shardCreate', shard => console.log(`Started shard ${shard.id}`));

manager.spawn();