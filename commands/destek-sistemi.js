const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")

module.exports = {
    name: "destek-sistemi",
    description: "Sunucuna destek sistemini kurarsın.",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Üyelerin destek açacağı kanalı ayarlarsın.",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "kategori",
            description: "Açılan destek kanallarının kategori altında toplanmasını sağlarsın.",
            type: 7,
            required: true,
            channel_types: [4]
        },
        {
            name: "yetkili-rol",
            description: "Üyelere yardım edecek yetkili rolünü ayarlarsın.",
            type: 8,
            required: true,
        },
        {
            name: "log",
            description: "Destek log kanalını ayarlarsın.",
            type: 7,
            required: false,
            channel_types: [0]
        }
    ],

    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Özelleştir")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("destekOzellestir" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Destek Ayarlar")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("destekAyarlar" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const kanal = interaction.options.getChannel('kanal')
        const yetkiliRol = interaction.options.getRole('yetkili-rol')
        const kategori = interaction.options.getChannel('kategori')

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:approve:1053645709997514803> Destek sistemi başarıyla ayarlandı **${interaction.user.username}**\n\n> #️⃣ ${kanal} __destek kanalı__ olarak ayarlandı\n> 🏷️ ${yetkiliRol} __destek rolü__ olarak ayarlandı\n> 📋 Sistemi özelleştirmek için **__özelleştir__** butonuna tıkla`)

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${yetkiliRol} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${yetkiliRol} rolünün üzerine sürüklemelisin.`)

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })
        if (yetkiliRol.position >= yetkiliRol.guild.members.me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
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
        }

        const log = interaction.options.getChannel('log')

        await interaction.deferReply();

        interaction.followUp({ embeds: [ayarlandi], components: [row] });

        if (log) {
            louritydb.set(`destekSistemi_${interaction.guild.id}`, { kanal: kanal.id, kategori: kategori.id, yetkili: yetkiliRol.id, log: log.id })
        }

        if (!log) {
            louritydb.set(`destekSistemi_${interaction.guild.id}`, { kanal: kanal.id, kategori: kategori.id, yetkili: yetkiliRol.id })
        }
    }
};