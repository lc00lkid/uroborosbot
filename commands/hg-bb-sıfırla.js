const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")

module.exports = {
    name: "hoşgeldin-sistemi-sıfırla",
    description: "Hoşgeldin sistemini sıfırlarsın",
    type: 7,
    options: [],

    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Hoşgeldin kanalı başarıyla sıfırlandı.`)

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        let kontrol = louritydb.get(`hosgeldinKanal_${interaction.guild.id}`)

        if (!kontrol) {
            const zatenVar = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Hoşgeldin sistemi zaten sıfırlanmış.`)

            return interaction.followUp({ embeds: [zatenVar] })
        }

        interaction.followUp({ embeds: [ayarlandi] }).catch(e => { })

        louritydb.delete(`hosgeldinKanal_${interaction.guild.id}`)
    }

};