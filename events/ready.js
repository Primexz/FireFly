module.exports = async (client) => {
    console.log("FireFly Bot loaded!")

    //Init Activity Handeling
    require('../handlers/discordActivityHandler')(client)
}