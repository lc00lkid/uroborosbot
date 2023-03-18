const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")
module.exports = {
    name: "kayıt-isim-sıfırla",
    description: "Yapay zeka kayıt sistemindeki ismini sıfırlarsın.",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Tekrar kayıt olmak ister misin?")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("yenidenKayit")
            )

        let kayitKontrol = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        let kontrol = louritydb2.get(`registerComplete_${interaction.member.id}`)

        const kayitSistemYok = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu sunucuda yapay zeka kayıt sistemi aktif değil.")

        if (!kayitKontrol) return interaction.reply({ embeds: [kayitSistemYok], ephemeral: true })

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Yapay zeka kayıt sistemindeki kayıtlı ismin sıfırlandı.`)

        if (!kontrol) {
            const isminYok = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Yapay zeka kayıt sisteminde kayıtlı bir ismin bulunmuyor.`)

            return interaction.reply({ embeds: [isminYok], ephemeral: true })
        }

        interaction.reply({ embeds: [ayarlandi], components: [row], ephemeral: true }).catch(e => { })

        louritydb2.delete(`registerComplete_${interaction.member.id}`)
        louritydb2.delete(`unisexCinsiyet_${interaction.member.id}`)
        louritydb2.delete(`unisex_${interaction.member.id}`)
    }

};