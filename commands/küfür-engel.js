const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "küfür-engel",
    description: "Küfür engel sistemini ayarlarsın",
    type: 1,
    options: [
        {
            name: "ayarla",
            description: "Küfür engel sistemini açarsın/kapatırsın.",
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Aç',
                    value: "ac"
                },

                {
                    name: 'Kapat',
                    value: "kapat"
                }
            ]
        },

    ],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ayarlandi = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription("Küfür engel sistemi başarıyla ayarlandı.")

        const sifirlandi = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription("Küfür engel sistemi başarıyla sıfırlandı.")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [botYetki] })


        let input = interaction.options.getString('ayarla')

        if (input === 'ac') {

            let kontrol = louritydb.get(`kufurEngel_${interaction.guild.id}`)

            if (kontrol) {

                const kontrolEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Küfür engel sistemi zaten ayarlanmış.")

                return interaction.followUp({ embeds: [kontrolEmbed] })
            }

            interaction.followUp({ embeds: [ayarlandi] })
            louritydb.set(`kufurEngel_${interaction.guild.id}`, true)
            return;
        }

        if (input === 'kapat') {

            let kontrol = louritydb.get(`kufurEngel_${interaction.guild.id}`)

            if (!kontrol) {

                const kontrolEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Küfür engel sistemi zaten sıfırlanmış.")

                return interaction.followUp({ embeds: [kontrolEmbed] })
            }

            interaction.followUp({ embeds: [sifirlandi] })
            louritydb.delete(`kufurEngel_${interaction.guild.id}`)
        }

    }

};