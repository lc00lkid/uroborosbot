const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js")
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")

module.exports = {
    name: "destek-ayarlar",
    description: "Destek sisteminin ayarlarına bakarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Destek Mesajını Özelleştir")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("destekMesaji" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Buton Rengi")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("butonRenk" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) {

            const sistemKapali = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Destek sistemi sunucuda aktif değil.")

            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
            return interaction.reply({ embeds: [sistemKapali], ephemeral: true })
        }
        let kanal = destek.kanal
        let yetkili = destek.yetkili
        let kategori = destek.kategori
        let log = destek.log
        let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)

        const ayarlarMesaj = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("> Destek sistemi ayarları aşağıda mevcut, sistemi **__özelleştirmek__** için aşağıdaki butonlara tıkla!")
            .addFields(
                { name: "Destek Kanalı:", value: `<#${kanal}>`, inline: true },
                { name: "Destek Kategorisi:", value: `<#${kategori}>`, inline: true },
                { name: "Destek Log:", value: `<#${log || "ayarlanmamış"}>`, inline: true },
                { name: "Destek Yetkilisi:", value: `<@&${yetkili}>`, inline: true },
                { name: "Destek Mesajı:", value: `[Mesaja Git](${`https://discord.com/channels/${interaction.guild.id}/${kanal}/${mesaj}`})`, inline: true },
            )

        await interaction.deferReply();

        return interaction.followUp({ embeds: [ayarlarMesaj], components: [row] });
    }
};