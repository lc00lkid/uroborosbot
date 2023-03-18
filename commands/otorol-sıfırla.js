const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "otorol-sıfırla",
    description: "Otorol sistemini sıfırlarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ayarlandi = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`Otorol sistemi başarıyla sıfırlandı.`)

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        let kontrol = louritydb.get(`otorol_${interaction.guild.id}`)

        if (!kontrol) {
            const zatenVar = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Otorol sistemi zaten sıfırlanmış.`)

            return interaction.followUp({ embeds: [zatenVar] })
        }

        interaction.followUp({ embeds: [ayarlandi] }).catch(e => { })

        louritydb.delete(`otorol_${interaction.guild.id}`)

    }

};