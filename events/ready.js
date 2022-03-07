module.exports = async (client) => {
    console.log(`[FF-BOT] Initial setup finished, FireFly is now ready!`)

    //Init Activity Handeling
    require('../handlers/discordActivityHandler')(client)
}
