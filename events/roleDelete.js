const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js")
const louritydb = require("croxydb")

module.exports = async (client, role) => {

    let kanalLog = louritydb.get(`rolLog_${role.guild.id}`)


    if (kanalLog) {
        const kontrol = role.guild.channels.cache.get(kanalLog)

        if (!kontrol) {
            louritydb.delete(`rolLog_${role.guild.id}`)
            return;
        }

        let me = role.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        var fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: Discord.AuditLogEvent.RoleDelete,
        });

        var roleLog = fetchedLogs.entries.first();


        if (roleLog.executor?.bot) return;
        if (role.guild.ownerId === roleLog.executor.id) return;

        let logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`<:hyphen:1052261065787973653> Sunucuda bir rol **silindi**: **${roleLog.changes[0].old || "bulunamadı"}**`)
            .addFields(
                { name: "Silindiği Zaman:", value: "<t:" + Math.floor(Date.now() / 1000) + ":F>" },
                { name: "Kullanıcı:", value: `${roleLog.executor} (${roleLog.executor.id})` },
            )
            .setThumbnail(roleLog.executor.avatarURL({ dynamic: true }))
            .setTimestamp()

        kontrol.send({ embeds: [logEmbed] }).catch((e) => { })
    }
}