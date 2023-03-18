const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "yeni-hesap-engel",
    description: "15 günden önce açılmış hesapları engelleme sistemi",
    type: 1,
    options: [
        {
            name: "log-kanalı",
            description: "Yeni hesap olan üyeler engellendiğinde mesaj gidecek kanal.",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "cezalı-rolü",
            description: "Yeni hesap olan üyelere verilecek rol.",
            type: 8,
            required: true,
        },
    ],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const logKanal = interaction.options.getChannel('log-kanalı')
        const cezalıRol = interaction.options.getRole('cezalı-rolü')

        const basarili = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`${logKanal} **yeni hesap engel** log kanalı olarak ayarlandı,\n${cezalıRol} rolüde cezalı rol olarak ayarlandı.`)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${cezalıRol} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${cezalıRol} rolünün üzerine sürüklemelisin.`)

        if (cezalıRol.position >= cezalıRol.guild.members.me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })


        interaction.reply({ embeds: [basarili], ephemeral: true })

        louritydb.set(`yeniHesapEngel_${interaction.guild.id}`, { log: logKanal.id, rol: cezalıRol.id })

    }

};