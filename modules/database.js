const Discord = require('discord.js');
const fetch = require('node-fetch');
const discordClient = require("../handlers/VariableHandler").client;
const db = require('better-sqlite3')('./FireFly-DB.sqlite');


module.exports = {

    stats: {
        prepareDB: function () {
            db.prepare("CREATE TABLE IF NOT EXISTS statistic(commands INTEGER, songs INTEGER, buttons INTEGER)").run()
            const statEntry = db.prepare("SELECT * FROM statistic").get()
            if(!statEntry)
                db.prepare("INSERT INTO statistic(commands, songs, buttons) VALUES (?, ?, ?)").run(0, 0 ,0)


        },
        addSong: async function () {
            await db.prepare("UPDATE statistic SET songs = statistic.songs + 1").run()
        },
        addCommand: async function () {
            await db.prepare("UPDATE statistic SET commands = statistic.commands + 1").run()
        },
        addButton: async function () {
            await db.prepare("UPDATE statistic SET buttons = statistic.buttons + 1").run()
        }
    }
}