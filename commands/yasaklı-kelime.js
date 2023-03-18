const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: "yasaklı-kelime",
    description: 'Yasaklı kelime eklersin/silersin.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Ekle")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("kelimeEkle" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Sil")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("kelimeSil" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Yasaklı Kelimeler")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("kelimeler" + interaction.user.id)
            )

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("> Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const yasakliEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setTitle("Yasaklı Kelime")
            .setDescription("`・` Yasaklı kelime eklemek için **Ekle** butonuna tıklayın\n`・` Yasaklı kelime silmek için **Sil** butonuna tıklayın\n`・` Kelime listesine bakmak için **Yasaklı Kelimeler** butonuna tıklayın")
            .setFooter({ text: `${interaction.guild.name}` })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))

        interaction.reply({ embeds: [yasakliEmbed], components: [row] });

    }

};