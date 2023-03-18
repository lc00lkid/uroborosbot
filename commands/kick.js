const { PermissionsBitField, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js");
const louritydb2 = require("orio.db")

module.exports = {
    name: "kick",
    description: 'Kullanıcıyı sunucudan atarsın',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kimi atmamı istersin?",
            type: 6,
            required: true
        },

    ],
    run: async (client, interaction) => {

        const uyeYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Üyeleri At` yetkisine sahip olmalısın!")

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        const uyeBulunamadi = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Belirttiğin üyeyi bulamadım.")

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kullanıcının rolü benim rolümden yüksek.")

        const pozisyon2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kullanıcının rolü senin rolünden yüksek.")

        const sunucuSahibi = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Sunucu sahibini atamazsın dostum.")

        const kendiniSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kendini atamazsın dostum.")

        const botuSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Beni atamazsın böhöhyt.")

        const hata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Komutu kullanırken bir hata oluştu.")

        const kullanıcı = interaction.options.getMember("kullanıcı")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({ embeds: [uyeYetki], ephemeral: true })
        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        if (!kullanıcı) return interaction.reply({ embeds: [uyeBulunamadi], ephemeral: true })
        if (interaction.guild.ownerId === kullanıcı.id) return interaction.reply({ embeds: [sunucuSahibi], ephemeral: true })
        if (interaction.author === kullanıcı.id) return interaction.reply({ embeds: [kendiniSusturma], ephemeral: true })
        if (client.user.id === kullanıcı.id) return interaction.reply({ embeds: [botuSusturma], ephemeral: true })

        if (interaction.guild.ownerId !== interaction.author) {
            if (kullanıcı.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [pozisyon2], ephemeral: true })
        }

        if (kullanıcı.roles.highest.position >= me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })

        kullanıcı.kick().catch((e) => {
           return interaction.reply({ embeds: [hata], ephemeral: true });
        })
        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${kullanıcı} adlı üyeyi başarıyla sunucudan attım.`)

        interaction.reply({ embeds: [basarili], ephemeral: true }).catch((e) => {
            interaction.reply({ embeds: [hata], ephemeral: true });
        })
    }

};