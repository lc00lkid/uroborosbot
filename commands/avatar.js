const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    name: "avatar",
    description: 'Avatarını veya başkasının avatarını görüntülersin',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kimin avatarına bakmak istersin?",
            type: 6,
            required: false
        },

    ],
    run: async (client, interaction) => {

        const user = interaction.options.getMember('kullanıcı')
        let member = user || interaction.user;
        let avatarURL = member.displayAvatarURL({ size: 1024, dynamic: true })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Avatar Link')
                    .setStyle(ButtonStyle.Link)
                    .setURL(avatarURL)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setImage(`${avatarURL}`)
            .setColor("ff7063")

        await interaction.deferReply();

        interaction.followUp({ embeds: [embed], components: [row] }).catch(e => { })

    }
}