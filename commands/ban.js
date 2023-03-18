const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js");
const louritydb2 = require("orio.db")
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "ban",
    description: 'Kullanıcıyı sunucudan yasaklarsın',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Kimi yasaklamamı istersin?",
            type: 6,
            required: true
        },
        {
            name: "sebep",
            description: "Hangi sebepten dolayı yasaklanacak?",
            type: 3,
            required: true
        },
    ],
    run: async (client, interaction) => {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Banı Kaldır")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("bankaldir")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🗑️")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("BanMessageDelete" + interaction.user.id)
            )

        const uyeYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Üyeleri Banla` yetkisine sahip olmalısın!")

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
            .setDescription("Sunucu sahibini banlayamazsın dostum.")

        const kendiniSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Kendini banlayamazsın dostum.")

        const botuSusturma = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Beni banlayamazsın böhöhyt.")

        const hata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanırken bir hata oluştu, lütfen tekrar deneyin.")

        const kullanıcı = interaction.options.getMember("kullanıcı")
        const sebep = interaction.options.getString("sebep")

        const kullanıcıı = interaction.options.getUser("kullanıcı")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ embeds: [uyeYetki], ephemeral: true })
        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        if (!kullanıcı) return interaction.reply({ embeds: [uyeBulunamadi], ephemeral: true })
        if (interaction.guild.ownerId === kullanıcı.id) return interaction.reply({ embeds: [sunucuSahibi], ephemeral: true })
        if (interaction.author === kullanıcı.id) return interaction.reply({ embeds: [kendiniSusturma], ephemeral: true })
        if (client.user.id === kullanıcı.id) return interaction.reply({ embeds: [botuSusturma], ephemeral: true })

        if (interaction.guild.ownerId !== interaction.member.id) {
            if (kullanıcı.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [pozisyon2], ephemeral: true })
        }

        if (kullanıcı.roles.highest.position >= me.roles.highest.position) return interaction.reply({ embeds: [pozisyon], ephemeral: true })

        kullanıcı.ban({ reason: `${sebep} (${interaction.user.tag})` }).catch((e) => {
            return interaction.reply({ embeds: [hata], ephemeral: true });
        })
        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`${kullanıcı} adlı üyeyi **${sebep}** sebebiyle banladım.`)

        interaction.reply({ embeds: [basarili], components: [row1] }).then(async (msg) => {

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === "bankaldir") {

                    const uyeYetki = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Bunu yapabilmek için `Üyeleri Banla` yetkisine sahip olmalısın!")

                    if (!i.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ embeds: [uyeYetki], ephemeral: true })

                    const kaldirildi = new EmbedBuilder()
                        .setDescription(`<@${kullanıcıı.id}> adlı kullanıcının banı başarıyla kaldırıldı.`)
                        .setColor("Green")

                    i.reply({ embeds: [kaldirildi], ephemeral: true }).catch(e => { })


                    interaction.deleteReply();
                    interaction.guild.members.unban(kullanıcıı)

                }
            });


        }).catch(e => {
            return interaction.reply({ embeds: [hata], ephemeral: true });
        })
    }

};