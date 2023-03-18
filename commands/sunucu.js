const { Client, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const louritydb2 = require("orio.db")

module.exports = {
    name: "sunucu",
    description: "Sunucu hakkında bilgi alırsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🔄")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("SunucuGuncelle" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )


        const server = interaction.guild

        let serverSize = server.memberCount;
        let botCount = server.members.cache.filter(m => m.user.bot).size;
        const owner = server.members.cache.get(server.ownerId);


        let metin = server.channels.cache.filter(t => t.type === Discord.ChannelType.GuildText).size;
        let ses = server.channels.cache.filter(t => t.type === Discord.ChannelType.GuildVoice).size;
        let kategori = server.channels.cache.filter(t => t.type === Discord.ChannelType.GuildCategory).size;


        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " gün" : " gün") + " önce";
        }

        const serverİnfoEmbed = new EmbedBuilder()
            .setAuthor({ name: `${server.name} | Sunucu Bilgileri`, iconURL: server.iconURL({ dynamic: true }) })
            .addFields(
                { name: "Sunucu Sahibi:", value: `${owner || "bulunamadı"}`, inline: true },
                { name: "Sunucu Kuruluş:", value: `📅 \`${checkDays(server.createdAt)}\``, inline: true },
                { name: "Takviye Sayısı:", value: `<a:boost:1050086275618709534> ${server.premiumSubscriptionCount}`, inline: true },
                { name: `Kanallar [${server.channels.cache.size}]`, value: `<:metin:1050066034926833786> ${metin} <:ses:1050066036466139176> ${ses} <:kategori:1050066033471397969> ${kategori}`, inline: true },
                { name: "Roller:", value: `🏷️ \`${server.roles.cache.size}\``, inline: true },
                { name: `Tüm Kullanıcılar [${serverSize}]`, value: `👥 **${serverSize - botCount}** | 🤖 **${botCount}**` },
            )
            .setThumbnail(server.iconURL({ dynamic: true }) || interaction.user.avatarURL({ dynamic: true }) || client.user.displayAvatarURL())
            .setColor("ff7063")

        await interaction.deferReply();

        return interaction.followUp({ embeds: [serverİnfoEmbed], components: [row1] }).catch(e => { })

    }

};