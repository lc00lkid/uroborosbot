const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")

module.exports = {
    name: "destek-sistemi-sıfırla",
    description: "Destek sistemini sıfırlarsın.",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const sifirlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Destek sistemi sunucunda başarıyla sıfırlandı.")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)

        if (!destek) {
            const zatenSifirlanmis = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Destek sistemi zaten sıfırlanmış.")

            return interaction.followUp({ embeds: [zatenSifirlanmis] });
        }

        if (destek) {
            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)

            if (channel) {
                const msg = await channel.messages.fetch(mesaj).catch((e) => { })
                if (msg) {
                    msg.delete()
                }
            }
            louritydb.delete(`destekSistemi_${interaction.guild.id}`)
            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
            return interaction.followUp({ embeds: [sifirlandi] });
        }

    }
};