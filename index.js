const { ShardingManager } = require('discord.js');
require('dotenv').config();
const botToken = process.env.BOT_TOKEN


const manager = new ShardingManager('./bot.js', { token: botToken, totalShards: 2 });

manager.on('shardCreate', shard => console.log(`Started shard ${shard.id} (Total ${manager.totalShards} shards)`));

manager.spawn();