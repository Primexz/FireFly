const Discord = require('discord.js');
const util = require("util");
const utils = require("../../modules/utils");
const {quote} = require("@discordjs/builders");
const Permissions = Discord.Permissions.FLAGS

module.exports = {

    name: 'music_queue',
    permissions: [],

    async execute(client, interaction) {

        if (utils.usrNoVoice(interaction))
            return;

        if (utils.musicQueueEmptyCheck(client, interaction))
            return;

        await interaction.deferReply();


        const page = interaction.options.getInteger('page') ? parseInt(interaction.options.getInteger('page')) : 1;
        const itemsPerPage = 5;

        const queue = client.distube.getQueue(interaction).songs;


        let embedDescription = '';
        queue.slice((page - 1) * itemsPerPage, itemsPerPage * page).map((singleSong, i) => {
            embedDescription += `**${i + 1 + (page - 1) * itemsPerPage}:** ${singleSong.name}\`\`\`Duration: ${singleSong.formattedDuration}\nArtist: ${singleSong.uploader.name} \`\`\` \n\n`
        })

        const pageCount = Math.ceil(queue.length / itemsPerPage)
        if (page > pageCount || page <= 0)
            return interaction.editReply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(utils.EmbedColors.Error)
                        .setTitle(`${utils.Icons.error} Invalid Page`)
                        .setDescription(`Your input corresponds to an invalid page.\nThe maximum number of pages is **${Math.ceil(queue.length / itemsPerPage)}**`)
                        .setFooter({
                            text: `Page: ${page}/${Math.ceil(queue.length / itemsPerPage)}\n${utils.Embeds.footerText}`,
                            iconURL: client.user.displayAvatarURL({dynamic: true})
                        })
                        .setTimestamp(new Date())
                ]
            });

        await interaction.editReply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Queue`)
                .setDescription(embedDescription)
                .setFooter({
                    text: `Page: ${page}/${Math.ceil(queue.length / itemsPerPage)}\n${utils.Embeds.footerText}`,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })
    },
};