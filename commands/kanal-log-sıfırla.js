const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")

module.exports = {
    name: "kanal-log-sıfırla",
    description: "Kanal log sistemini sıfırlarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki], ephemeral: true })

        let kontrol = louritydb.get(`kanalLog_${interaction.guild.id}`)

        if (!kontrol) {
            const zatenVar = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Kanal log sistemi zaten sıfırlanmış.`)

            return interaction.followUp({ embeds: [zatenVar], ephemeral: true })
        }

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Kanal log sistemi başarıyla sıfırlandı.`)

        interaction.followUp({ embeds: [ayarlandi], ephemeral: true })

        louritydb.delete(`kanalLog_${interaction.guild.id}`);

    }
};