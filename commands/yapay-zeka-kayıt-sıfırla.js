const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "yapay-zeka-kayıt-sıfırla",
    description: "Yapay zekalı kayıt sistemini sıfırlarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const basarili = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription("Yapay zeka kayıt sistemi başarıyla sıfırlandı.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        let kontrol = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        if (!kontrol) {

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka kayıt sistemi zaten sıfırlanmış.")
            return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })
        }

        interaction.reply({ embeds: [basarili], ephemeral: true })

        louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
    }

};