const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "timeout",
    description: "Kullanıcıyı sunucuda susturursun",
    options: [{
        type: 6,
        name: "kullanıcı",
        description: "Kimi susturmamı istersin?",
        required: true
    },
    {
        type: 3,
        name: "süre",
        description: "Ne kadar süre susturmamı istersin? 1m, 1h, 1d gibi bir süre belirt.",
        required: true
    }],
    type: 1,

    run: async (client, interaction, message) => {

        const uyeYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Zamanaşımı Uygula` yetkisine sahip olmalısın!")

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        const uyeBulunamadi = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Belirttiğin üyeyi bulamadım.")

        const pozisyon = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kullanıcının rolü benim rolümden yüksek.")

        const pozisyon2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kullanıcının rolü senin rolünden yüksek.")

        const sunucuSahibi = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Sunucu sahibini susturamazsın dostum.")

        const kendiniSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kendine neden timeout atmak istersin ki?")

        const botuSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Ben bir botum, beni susturup ne yapacaksın?")

        const gecerliSure = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Susturabilmem için geçerli bir süre girmelisin.")

        const hata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Komutu kullanırken bir hata oluştu.")

        const kullanıcı = interaction.options.getMember("kullanıcı")
        const süre = interaction.options.getString("süre")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ embeds: [uyeYetki], ephemeral: true })
        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        if (!kullanıcı) return interaction.reply({ embeds: [uyeBulunamadi], ephemeral: true })
        if (interaction.guild.ownerId === kullanıcı.id) return interaction.reply({ embeds: [sunucuSahibi], ephemeral: true })
        if (interaction.author === kullanıcı.id) return interaction.reply({ embeds: [kendiniSusturma], ephemeral: true })
        if (client.user.id === kullanıcı.id) return interaction.reply({ embeds: [botuSusturma], ephemeral: true })

        if (interaction.guild.ownerId !== interaction.author) {
            if (kullanıcı.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [pozisyon2], ephemeral: true })
        }

        if (kullanıcı.roles.highest.position >= me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })

        const timeout = ms(süre)
        if (!timeout) return interaction.reply({ embeds: [gecerliSure], ephemeral: true })

        await kullanıcı.timeout(timeout).catch((e) => {
            return interaction.reply({ embeds: [hata], ephemeral: true })
        })

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${kullanıcı} adlı kullanıcıya **${süre}** süre boyunca timeout atıldı!`)

        interaction.reply({ embeds: [basarili], ephemeral: true }).catch((e) => {
            interaction.reply({ embeds: [hata], ephemeral: true });
        })

    }
};
