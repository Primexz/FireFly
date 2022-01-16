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

        const page = interaction.options.getNumber('page') ? parseInt(interaction.options.getNumber('page')) : 1;

        const queue = client.distube.getQueue(interaction).songs;


        let embedDescription = '';
        queue.slice((page - 1) * 5, 5 * page).map((singleSong, i) => {
            embedDescription += `**${i + 1}:** ${singleSong.name}\`\`\`Duration: ${singleSong.formattedDuration}\nArtist: ${singleSong.uploader.name} \`\`\` \n\n`
        })

        const pageCount = Math.ceil(queue.length / 5)
        if (page > pageCount || page <= 0)
            return interaction.reply({content: "Invalid page count.", ephemeral: true});

        await interaction.editReply({
            content: null,
            embeds: [new Discord.MessageEmbed()
                .setColor(utils.EmbedColors.Default)
                .setTitle(`${utils.Icons.music} Music Queue`)
                .setDescription(embedDescription)
                .setFooter({
                    text: `Page: ${page}/${Math.ceil(queue.length / 10)}\n${utils.Embeds.footerText}`,
                    iconURL: client.user.displayAvatarURL({dynamic: true})
                })
                .setTimestamp(new Date())]
        })
    },
};