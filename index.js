const {ShardingManager} = require('discord.js');
const {rCache} = require("./modules/redisController");
require('dotenv').config();
const botToken = process.env.BOT_TOKEN
const manager = new ShardingManager('./bot.js', {token: botToken, totalShards: 'auto'});
const db = require("./modules/database")

async function updateRedis(rClient) {
    const time1 = Date.now()
    const voiceStreams = (await manager.fetchClientValues('voice.adapters.size')).reduce((acc, voiceCount) => acc + voiceCount, 0);
    const guilds = (await manager.fetchClientValues('guilds.cache.size')).reduce((acc, guildCount) => acc + guildCount, 0)
    const userCount = (await manager.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))).reduce((acc, memberCount) => acc + memberCount, 0);
    const currentDB = await db.stats.getStats()
    rClient.hSet('statistics', {
        voiceStreams: voiceStreams,
        guilds: guilds,
        userCount: userCount,
        commands: currentDB.commands,
        buttons: currentDB.buttons,
        songs: currentDB.songs
    })
    const time2 = Date.now()
    console.log(`[SHARD-MANAGER] Synced values with Redis => ${time2-time1}ms`)
}

manager.on('shardCreate', shard => console.log(`[SHARD-MANAGER] Started shard ${shard.id} (Total ${manager.totalShards} shards)`));

manager.spawn().then(function () {
    //start FireFly API
    require('./api/index')(manager)

    //manage redis data
    const {rCache} = require('./modules/redisController')
    const redisCache = new rCache('main')
    redisCache.init().then(async (redisClient) => {
        await updateRedis(redisClient)
        setInterval(async () => {
            await updateRedis(redisClient)
        }, 30000)
    })
});


