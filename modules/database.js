const Discord = require('discord.js');
const fetch = require('node-fetch');
const discordClient = require("../handlers/VariableHandler").client;
const db = require('better-sqlite3')('./FireFly-DB.sqlite');


module.exports = {

    stats: {
        prepareDB: function () {
            db.prepare("CREATE TABLE IF NOT EXISTS statistic(commands INTEGER, songs INTEGER, buttons INTEGER)").run()
        }
    }
}