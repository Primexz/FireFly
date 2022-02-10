const express = require('express');
const app = express();
const port = 3468;
const db = require("../modules/database")
const slashCmds = require('../client-application/slashcmds')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

module.exports = manager => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    })

    // Apply middlewares to all routes
    app.use(limiter)
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(helmet())


    app.get('/api/cmds', (req, res) => {
        console.log("Recieved GET request on route /cmds")
        const commands = [];
        slashCmds.slashCmdData.forEach(command => {
            commands.push({
                name: command.name,
                description: command.description,
                options: command.options
            });
        });
        res.send(commands);
    });


    //dynamic update db (cache)
    let dbStats = {
        commands: 0,
        songs: 0,
        buttons: 0
    }
    setInterval(async function () {
        const currentDB = await db.stats.getStats()

        dbStats.songs = currentDB.songs
        dbStats.commands = currentDB.commands
        dbStats.buttons = currentDB.commands
    }, 15000)



    app.get('/api/stats', async (req, res) => {
        console.log("Recieved GET request on route /stats")
        const promises = [
            manager.fetchClientValues('guilds.cache.size'),
            manager.broadcastEval(c => c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)),
            manager.fetchClientValues('voice.adapters.size')
        ];

        Promise.all(promises)
            .then(async results => {
                const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
                const totalPlayers = results[2].reduce((acc, voiceCount) => acc + voiceCount, 0)

                const stats = {
                    guilds: totalGuilds,
                    users: totalMembers,
                    streams: totalPlayers,
                    commandsUsed: dbStats.commands,
                    buttonsClicked: dbStats.buttons,
                    songsPlayed: dbStats.songs
                };
                res.send(stats);
            }).catch(err => console.log(err));
    });

    //404 Page Middleware
    app.use((req, res) => {
        res.status(404).send(`
            <h1>404 - Page not found</h1>
            Your requested route was not found on the server!
        `)
    })

    app.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).send(`
            <h1>500 - Internal Server Error</h1>
            An unknown error occurred!
            Please contact the owner of the bot! (Prime#7066)
        `)
    })

    app.listen(port, () => {
        console.log(`API listening at http://localhost:${port}`);
    });
};