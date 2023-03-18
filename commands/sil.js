const { Client, EmbedBuilder, PermissionsBitField, messageLink } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: "sil",
    description: 'Sohbette belirtilen miktar kadar mesaj silersin',
    type: 1,
    options: [
        {
            name: "sayı",
            description: "Silinecek mesaj sayısını girin.",
            type: 3,
            required: true
        },

    ],
    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Mesajları Yönet` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")


        const hata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanırken bir hata oluştu, lütfen tekrar deneyin.")

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })


        const sayi = interaction.options.getString('sayı')

        const sayiembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Girdiğin sayı 100 den büyük olamaz.")

        const sayiembed2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Girdiğin sayı 2 den küçük olamaz.")

        if (sayi > 100) return interaction.reply({ embeds: [sayiembed], ephemeral: true })
        if (sayi < 2) return interaction.reply({ embeds: [sayiembed2], ephemeral: true })

        interaction.channel.bulkDelete(sayi).catch(e => { })

        interaction.reply({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`**${sayi}** tane mesajı başarıyla uzaya gönderdim :rocket:`)], ephemeral: true }).catch(e => {
            return interaction.reply({ embeds: [hata], ephemeral: true });
        })

    }

};