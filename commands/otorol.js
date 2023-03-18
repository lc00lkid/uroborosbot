const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")

module.exports = {
    name: "otorol",
    description: "Otorol sistemini ayarlarsın",
    type: 1,
    options: [
        {
            name: "üye-rol",
            description: "Üyelere hangi rolü vereyim?",
            type: 8,
            required: true,
        },
        {
            name: "bot-rol",
            description: "Botlara hangi rolü vereyim?",
            type: 8,
            required: true,
        },
        {
            name: "log",
            description: "Otorol log kanalını ayarlarsın.",
            type: 7,
            required: false,
            channel_types: [0]
        }
    ],

    run: async (client, interaction) => {

        const uyeRol = interaction.options.getRole('üye-rol')
        const botRol = interaction.options.getRole('bot-rol')

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:approve:1053645709997514803> Otorol sistemi başarıyla ayarlandı **${interaction.user.username}**\n\n> 🏷️ ${uyeRol} __üye rolü__ olarak ayarlandı\n> 🤖 ${botRol} __bot rolü__ olarak ayarlandı`)

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${uyeRol} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${uyeRol} rolünün üzerine sürüklemelisin.`)

        const pozisyon2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${botRol} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${botRol} rolünün üzerine sürüklemelisin.`)

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        if (uyeRol.position >= uyeRol.guild.members.me.roles.highest.position) return interaction.followUp({ embeds: [pozisyon] })
        if (botRol.position >= botRol.guild.members.me.roles.highest.position) return interaction.followUp({ embeds: [pozisyon2] })

        interaction.followUp({ embeds: [ayarlandi] })

        const log = interaction.options.getChannel('log')

        if (log) {
            louritydb.set(`otorol_${interaction.guild.id}`, { uye: uyeRol.id, bot: botRol.id, log: log.id })
        }

        if (!log) {
            louritydb.set(`otorol_${interaction.guild.id}`, { uye: uyeRol.id, bot: botRol.id })
        }
    }
};