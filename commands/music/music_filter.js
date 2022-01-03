const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_filter',
    permissions: [],

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return

        if (utils.musicQueueEmptyCheck(client, interaction))
            return

        const queue = client.distube.getQueue(interaction)
        const currentSong = queue.songs[0]


        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Filter`)
                .setDescription(`Here you can edit your active music filters of the current queue. Simply select the desired filters in our Select Menu.`)
                .setThumbnail(currentSong.thumbnail)
                .setFooter({
                    text: utils.Embeds.footerText,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())],
            components: [
                new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId('music-mng_filter')
                            .setPlaceholder('Select your music filter')
                            .setMinValues(0)
                            .setMaxValues(3)
                            .addOptions([
                                {
                                    label: '3D',
                                    description: 'Enable/Disable the 3D Sound Filter',
                                    value: '3d',
                                    emoji: '🎵',
                                    default: queue.filters.includes("3d")
                                },
                                {
                                    label: 'Bass Boost',
                                    description: 'Enable/Disable the Bassboost Sound Filter',
                                    value: 'bassboost',
                                    emoji: '🎵',
                                    default: queue.filters.includes("bassboost")
                                },
                                {
                                    label: 'Echo',
                                    description: 'Enable/Disable the Echo Sound Filter',
                                    value: 'echo',
                                    emoji: '🎵',
                                    default: queue.filters.includes("echo")
                                },
                                {
                                    label: 'Karaoke',
                                    description: 'Enable/Disable the Karaoke Sound Filter',
                                    value: 'karaoke',
                                    emoji: '🎵',
                                    default: queue.filters.includes("karaoke")
                                },
                                {
                                    label: 'Nightcore',
                                    description: 'Enable/Disable the Nightcore Sound Filter',
                                    value: 'nightcore',
                                    emoji: '🎵',
                                    default: queue.filters.includes("nightcore")
                                },
                                {
                                    label: 'Vaporwave',
                                    description: 'Enable/Disable the Vaporwave Sound Filter',
                                    value: 'vaporwave',
                                    emoji: '🎵',
                                    default: queue.filters.includes("vaporwave")
                                },
                                {
                                    label: 'Flanger',
                                    description: 'Enable/Disable the Flanger Sound Filter',
                                    value: 'flanger',
                                    emoji: '🎵',
                                    default: queue.filters.includes("flanger")
                                },
                                {
                                    label: 'Gate',
                                    description: 'Enable/Disable the Gate Sound Filter',
                                    value: 'gate',
                                    emoji: '🎵',
                                    default: queue.filters.includes("gate")
                                },
                                {
                                    label: 'Haas',
                                    description: 'Enable/Disable the Haas Sound Filter',
                                    value: 'haas',
                                    emoji: '🎵',
                                    default: queue.filters.includes("haas")
                                },
                                {
                                    label: 'Reverse',
                                    description: 'Enable/Disable the Reverse Sound Filter',
                                    value: 'reverse',
                                    emoji: '🎵',
                                    default: queue.filters.includes("reverse")
                                },
                                {
                                    label: 'Surround',
                                    description: 'Enable/Disable the Surround Sound Filter',
                                    value: 'surround',
                                    emoji: '🎵',
                                    default: queue.filters.includes("surround")
                                },
                                {
                                    label: 'Mcompand',
                                    description: 'Enable/Disable the Mcompand Sound Filter',
                                    value: 'mcompand',
                                    emoji: '🎵',
                                    default: queue.filters.includes("mcompand")
                                },
                                {
                                    label: 'Phaser',
                                    description: 'Enable/Disable the Phaser Sound Filter',
                                    value: 'phaser',
                                    emoji: '🎵',
                                    default: queue.filters.includes("phaser")
                                },
                                {
                                    label: 'Tremolo',
                                    description: 'Enable/Disable the Tremolo Sound Filter',
                                    value: 'tremolo',
                                    emoji: '🎵',
                                    default: queue.filters.includes("tremolo")
                                },
                                {
                                    label: 'Earwax',
                                    description: 'Enable/Disable the Earwax Sound Filter',
                                    value: 'earwax',
                                    emoji: '🎵',
                                    default: queue.filters.includes("earwax")
                                },
                            ]),
                    ),
            ]
        })

    },
};