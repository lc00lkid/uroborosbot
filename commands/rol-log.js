const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")

module.exports = {
    name: "rol-log",
    description: "Silinen veya oluşturulan rolleri görmenizi sağlar",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Log kanalını seçmelisin.",
            type: 7,
            required: true,
            channel_types: [0]
        },
    ],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })

        const kanal = interaction.options.getChannel('kanal')

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:approve:1053645709997514803> Rol log sistemi başarıyla ayarlandı **${interaction.user.username}**\n\n> #️⃣ ${kanal} __rol log kanalı__ olarak ayarlandı`)

        interaction.followUp({ embeds: [ayarlandi] })
        louritydb.set(`rolLog_${interaction.guild.id}`, kanal.id)

    }
};