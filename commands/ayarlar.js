const { Client, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js")
const louritydb = require("croxydb")
module.exports = {
    name: "ayarlar",
    description: "Sunucunun ayarlarına bakarsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {


        const row = new ActionRowBuilder()

            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('a1')
                    .setPlaceholder('Sıfırlamak istediğin sistemi seç')
                    .addOptions([
                        {
                            label: "Hoşgeldin sistemi",
                            description: "Hoşgeldin sistemini sıfırlarsın",
                            emoji: "📥",
                            value: "hosgeldinSistemi"

                        },
                        {
                            label: "Otorol sistemi",
                            description: "Otorol sistemini sıfırlarsın",
                            emoji: "🧷",
                            value: "otorolSistemi"

                        },
                        {
                            label: "Küfür engel",
                            description: "Küfür engel sistemini sıfırlarsın",
                            emoji: "🤬",
                            value: "kufurEngelSistemi"

                        },
                        {
                            label: "Reklam engel",
                            description: "Reklam engel sistemini sıfırlarsın",
                            emoji: "🔗",
                            value: "reklamEngelSistemi"

                        },
                        {
                            label: "Mesaj Log",
                            description: "Mesaj log sistemini sıfırlarsın",
                            emoji: "💾",
                            value: "mesajLog"

                        },
                        {
                            label: "Kanal Log",
                            description: "Kanal log sistemini sıfırlarsın",
                            emoji: "#️⃣",
                            value: "kanalLog"

                        },
                        {
                            label: "Rol Log",
                            description: "Rol log sistemini sıfırlarsın",
                            emoji: "🏷️",
                            value: "rolLog"

                        },
                        {
                            label: "Yapay zeka kayıt sistemi",
                            description: "Yapay zeka kayıt sistemini sıfırlarsın",
                            emoji: "🤖",
                            value: "yapayZekaKayit"

                        },
                        {
                            label: "Destek sistemi",
                            description: "Destek sistemini sıfırlarsın",
                            emoji: "🎫",
                            value: "destekSistemi"

                        },
                        {
                            label: "Yeni hesap engel sistemi",
                            description: "Yeni hesap engel sistemini sıfırlarsın",
                            emoji: "🛡️",
                            value: "yeniHesapEngel"

                        }
                    ])

            )

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🔄")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("ayarlarRes" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })


        const server = interaction.guild

        let kufurEngel = louritydb.get(`kufurEngel_${interaction.guild.id}`)
        let reklamEngel = louritydb.get(`reklamEngel_${interaction.guild.id}`)
        let otorol = louritydb.get(`otorol_${interaction.guild.id}`)
        let hosgeldin = louritydb.get(`hosgeldinKanal_${interaction.guild.id}`)
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        let yeniHesapEngel = louritydb.get(`yeniHesapEngel_${interaction.guild.id}`)
        let destekSistemi = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        let mesajLog = louritydb.get(`mesajLog_${interaction.guild.id}`)
        let kanalLog = louritydb.get(`kanalLog_${interaction.guild.id}`)
        let rolLog = louritydb.get(`rolLog_${interaction.guild.id}`)

        const serverSettingsEmbed = new EmbedBuilder()
            .setAuthor({ name: `${server.name} | Sunucu Ayarları`, iconURL: server.iconURL({ dynamic: true }) })
            .addFields(
                { name: "🤬 küfür-engel", value: `${kufurEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🔗 reklam-engel", value: `${reklamEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🧷 otorol", value: `${otorol ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "📥 hoşgeldin-sistemi", value: `${hosgeldin ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "💾 mesaj-log", value: `${mesajLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "#️⃣ kanal-log", value: `${kanalLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🏷️ rol-log", value: `${rolLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🤖 yapay-zeka-kayıt", value: `${yapayZekaKayit ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🎫 destek-sistemi", value: `${destekSistemi ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🛡️ yeni-hesap-engel", value: `${yeniHesapEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
            )
            .setThumbnail(server.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
            .setColor("ff7063")

        await interaction.deferReply();

        return interaction.followUp({ embeds: [serverSettingsEmbed], components: [row, row1] }).catch(e => { })

    }
};