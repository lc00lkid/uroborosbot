const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "yapay-zeka-kayıt",
    description: "Yapay zekalı kayıt sistemini ayarlarsın",
    type: 1,
    options: [
        {
            name: "kayıt-kanalı",
            description: "Üyelerin kayıt olacağı kanalı ayarlarsınız.",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "erkek-rol",
            description: "Erkek üyelere verilecek rol.",
            type: 8,
            required: true,
        },
        {
            name: "kız-rol",
            description: "Kız üyelere verilecek rol.",
            type: 8,
            required: true,
        },
        {
            name: "kayıtsız-rol",
            description: "Kayıtsız üyelere verilecek rol.",
            type: 8,
            required: true,
        },
        {
            name: "tag",
            description: "Kayıt olan üyelerin isimlerinin başına koyulacak sembol.",
            type: 3,
            required: false,
        },
    ],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const basarili = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription("Yapay zekalı kayıt sistemi başarıyla ayarlandı.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const kayit = interaction.options.getChannel('kayıt-kanalı')
        const erkek = interaction.options.getRole('erkek-rol')
        const kiz = interaction.options.getRole('kız-rol')
        const kayitsiz = interaction.options.getRole('kayıtsız-rol')

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${erkek} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${erkek} rolünün üzerine sürüklemelisin.`)

        const pozisyon2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${kiz} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${kiz} rolünün üzerine sürüklemelisin.`)

        const pozisyon3 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${kayitsiz} benim rolümden yüksekte!\n\n**Sunucu Ayarları** -> __**Roller**__ kısmından rolümü ${kayitsiz} rolünün üzerine sürüklemelisin.`)

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        if (erkek.position >= erkek.guild.members.me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })
        if (kiz.position >= kiz.guild.members.me.roles.highest.position) return interaction.reply({ embeds: [pozisyon2], ephemeral: true })
        if (kayitsiz.position >= kayitsiz.guild.members.me.roles.highest.position) return interaction.reply({ embeds: [pozisyon3], ephemeral: true })
        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })


        interaction.reply({ embeds: [basarili], ephemeral: true })

        const tag = interaction.options.getString('tag')

        if (!tag) {
            louritydb.set(`yapayZekaKayit_${interaction.guild.id}`, { kayitKanal: kayit.id, erkekRol: erkek.id, kizRol: kiz.id, kayitsizRol: kayitsiz.id })
        }

        if (tag) {
            louritydb.set(`yapayZekaKayit_${interaction.guild.id}`, { kayitKanal: kayit.id, erkekRol: erkek.id, kizRol: kiz.id, kayitsizRol: kayitsiz.id, tag: tag })
        }
    }

};