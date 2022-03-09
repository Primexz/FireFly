const Discord = require('discord.js');
const utils = require("../../modules/utils");
const discordClient = require("../../handlers/VariableHandler").client;
const Permissions = Discord.Permissions.FLAGS
const {MessageActionRow, MessageSelectMenu} = require('discord.js');
const {redisClient} = require("../../handlers/VariableHandler");


function stringIsAValidUrl(s) {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {

    name: 'music_play',
    permissions: [],
    botRequiredPerms: [
        Permissions.SEND_MESSAGES,
        Permissions.CONNECT,
        Permissions.SPEAK,
    ],


    async execute(client, interaction) {

        const songUrl = interaction.options.getString('url')
        const forceSong = interaction.options.getBoolean('force') || false


        if (utils.usrNoVoice(interaction))
            return


        let requiredVoicePerms = [Permissions.CONNECT, Permissions.SPEAK]
        let requiredPerms = ""
        await requiredVoicePerms.forEach(value => {
            requiredPerms += `${interaction.member.voice?.channel.permissionsFor(client.user).has(value) ? ":white_check_mark:" : ":x:"}  **${Object.keys(Discord.Permissions.FLAGS).find(key => Discord.Permissions.FLAGS[key] === value)}**\n`
        })

        if (!interaction.member.voice?.channel.permissionsFor(client.user).has(requiredVoicePerms))
            return await interaction.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Error)
                    .setTitle(`${utils.Icons.error} Missing Bot Permissions`)
                    .setDescription("I need the following voice-permissions to execute the command correctly.")
                    .addField("Required Permissions", requiredPerms)
                    .setFooter({
                        text: utils.Embeds.footerText,
                        iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                    })
                    .setTimestamp(new Date())]
            })


        await interaction.deferReply()


        if (stringIsAValidUrl(songUrl)) {
            await discordClient.distube.play(interaction.member.voice?.channel, songUrl, {
                member: interaction.member,
                textChannel: interaction.channel,
                skip: forceSong
            });

            await interaction.editReply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(utils.EmbedColors.Default)
                    .setTitle(`${utils.Icons.music} Loading Music-Player..`)
                ]
            })
        } else {

            let searchResult;
            try {
                const redisClient = require("../../handlers/VariableHandler").redisClient
                let redisSearchCache = await redisClient.get(`searchCache_${songUrl.replace(' ', '--')}`) || null


                if(redisSearchCache == null || redisClient == 'null'){
                    searchResult = await discordClient.distube.search(songUrl)
                    await redisClient.set(`searchCache_${songUrl.replace(' ', '--')}`, JSON.stringify(searchResult), {
                        EX: 43200 //12 hours
                    })
                }
                else {
                    searchResult = JSON.parse(redisSearchCache)
                }

            } catch (e) {
                if (e.errorCode === "NO_RESULT") {
                    return interaction.editReply({
                        components: [],
                        embeds: [new Discord.MessageEmbed()
                            .setColor(utils.EmbedColors.Error)
                            .setTitle(`${utils.Icons.error} No Result`)
                            .setDescription(`FireFly did not find any songs under the entered search term!`)
                            .setFooter({
                                text: utils.Embeds.footerText,
                                iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                            })
                            .setTimestamp(new Date())]
                    })
                } else {
                    console.error('Detected FireFly-Error: ', e)
                    return interaction.editReply({
                        components: [],
                        embeds: [new Discord.MessageEmbed()
                            .setColor(utils.EmbedColors.Error)
                            .setTitle(`${utils.Icons.error} Unknown error`)
                            .setDescription(`An unexpected error occurred while resolving your search query!`)
                            .setFooter({
                                text: utils.Embeds.footerText,
                                iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                            })
                            .setTimestamp(new Date())]
                    })
                }

            }

            const rowOptions = [];
            searchResult.forEach(((value, index) => {
                rowOptions.push({
                    label: `${index + 1}: ${value.name}`.slice(0, 100),
                    description: value.uploader.name.slice(0, 100),
                    value: value.url.slice(0, 100)
                })
            }))


            await interaction.editReply(
                {
                    components: [new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('music-search_select')
                                .setPlaceholder('Please choose your desired song!')
                                .addOptions(rowOptions),
                        )
                    ],
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor(utils.EmbedColors.Default)
                            .setTitle(`${utils.Icons.music} Choose a song`)
                            .setDescription(`Please select a song you want to play.\nYou will see the ${searchResult.length} best search results based on your search term: ${songUrl}`)
                            .setFooter({
                                text: `--> You have 60 seconds to choose a song! <--\n${utils.Embeds.footerText}`,
                                iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                            })
                            .setTimestamp(new Date())
                    ]
                })
                .then(async m => {

                    const filter = m => m.user.id === interaction.user.id && m.customId === "music-search_select"
                    await m.awaitMessageComponent({
                        filter,
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async reaction => {
                        await reaction.deferUpdate();

                        console.log(searchResult)
                        const songToPlay = searchResult.find((songs) => songs.url === reaction.values[0])

                        await discordClient.distube.play(interaction.member.voice?.channel, songToPlay, {
                            member: interaction.member,
                            textChannel: interaction.channel,
                            skip: forceSong
                        });

                        await interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(utils.EmbedColors.Default)
                                .setTitle(`${utils.Icons.music} Loading Music-Player..`)
                            ],
                            components: []
                        })
                    }).catch(() => {
                        return interaction.editReply({
                            components: [],
                            embeds: [new Discord.MessageEmbed()
                                .setColor(utils.EmbedColors.Error)
                                .setTitle(`${utils.Icons.error} No Response`)
                                .setDescription(`You didn't choose a song within 60 seconds. The search is now canceled!`)
                                .setFooter({
                                    text: utils.Embeds.footerText,
                                    iconURL: discordClient.user.displayAvatarURL({dynamic: true})
                                })
                                .setTimestamp(new Date())]
                        })
                    })
                })
        }
    },
};
