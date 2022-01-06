const Discord = require('discord.js');
const fetch = require('node-fetch');
const discordClient = require("../handlers/VariableHandler").client;
const db = require('better-sqlite3')('./FireFly-DB.sqlite');


module.exports = {

    stats: {
        prepareDB: function () {
            db.prepare("CREATE TABLE IF NOT EXISTS statistic(commands INTEGER, songs INTEGER, buttons INTEGER)").run()
        },
        addSong: async function () {
            const statEntry = await db.prepare("SELECT * FROM statistic").get()
            if(!statEntry)
                await db.prepare("INSERT INTO statistic(commands, songs, buttons) VALUES (?, ?, ?)").run(0, 0 ,0)

            await db.prepare("UPDATE statistic SET songs = statistic.songs + 1").run()
        }
    }
}