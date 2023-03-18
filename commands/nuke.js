const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: "nuke",
    description: 'Kanaldaki tüm mesajları silersin.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Evet")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("nukeEvet" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Hayır")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("nukeHayır" + interaction.user.id)
            )

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })


        const uyari = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("Kanaldaki tüm mesajları silmek istediğinizden emin misiniz?")

        return interaction.reply({ embeds: [uyari], components: [row] })
    }
};