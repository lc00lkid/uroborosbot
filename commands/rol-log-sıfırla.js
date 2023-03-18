const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")

module.exports = {
    name: "rol-log-sıfırla",
    description: "Rol log sistemini sıfırlarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        let kontrol = louritydb.get(`rolLog_${interaction.guild.id}`)

        if (!kontrol) {
            const zatenVar = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Rol log sistemi zaten sıfırlanmış.`)

            return interaction.followUp({ embeds: [zatenVar] })
        }

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Rol log sistemi başarıyla sıfırlandı.`)

        interaction.followUp({ embeds: [ayarlandi] })

        louritydb.delete(`rolLog_${interaction.guild.id}`);

    }
};