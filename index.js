const { ShardingManager } = require('discord.js');
require('dotenv').config();
const botToken = process.env.BOT_TOKEN


const manager = new ShardingManager('./bot.js', { token: botToken, totalShards: 'auto' });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id} (Total ${manager.totalShards} shards)`));

manager.spawn().then(function () {
    require('./api/index')(manager)
});
