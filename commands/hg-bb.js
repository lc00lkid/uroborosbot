const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")

module.exports = {
    name: "hoşgeldin-sistemi",
    description: "Hoşgeldin sistemini ayarlarsın",
    type: 7,
    options: [
        {
            name: "kanal",
            description: "Hoşgeldin kanalını ayarlarsın.",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "mesaj",
            description: "Hoşgeldin mesajının embedli/embedsiz olmasını ayarlarsın.",
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Embedli Mesaj',
                    value: "embedli"
                },

                {
                    name: 'Embedsiz Mesaj',
                    value: "embedsiz"
                }
            ]
        },

    ],

    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const kanal = interaction.options.getChannel('kanal')

        let input = interaction.options.getString('mesaj');

        const ayarlandi = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:approve:1053645709997514803> Hoşgeldin sistemi başarıyla ayarlandı **${interaction.user.username}**\n\n> #️⃣ ${kanal} __hoşgeldin kanalı__ olarak ayarlandı\n> 📄 \`${input}\` __mesaj stili__ olarak ayarlandı`)

        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.followUp({ embeds: [yetki] })


        if (input === 'embedli') {
            interaction.followUp({ embeds: [ayarlandi] })
            louritydb.set(`hosgeldinKanal_${interaction.guild.id}`, { kanal: kanal.id, mesaj: true })
            return;
        }

        if (input === 'embedsiz') {
            interaction.followUp({ embeds: [ayarlandi] })
            louritydb.set(`hosgeldinKanal_${interaction.guild.id}`, { kanal: kanal.id, mesaj: false })
            return;
        }
    }

};