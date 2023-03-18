const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")

module.exports = async (client, message, oldMessage) => {

    let mesajlog = louritydb.get(`mesajLog_${message.guild.id}`)


    if (mesajlog) {
        const kontrol = message.guild.channels.cache.get(mesajlog)

        if (!kontrol) {
            louritydb.delete(`mesajLog_${message.guild.id}`)
            return;
        }

        let me = client.user.id
        if (!message.author?.bot) {
            if (!message.author) return;
            if (message.author.id !== me) {

                const oldMsg = oldMessage.content.slice(0, 1020);
                const msg = message.content.slice(0, 1020);

                const messageUpdate = new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription(`Mesaj ${message.channel || "kanal bulunamadı"} adlı kanalda düzenlendi`)
                    .addFields(
                        { name: "Atıldığı Zaman:", value: "<t:" + Math.floor(Date.now() / 1000) + ":F>" },
                        { name: `Kullanıcı:`, value: `<@!${message.author.id || "üye bulunamadı"}> (${message.author.id || "üye bulunamadı"})`, inline: true },
                        { name: `Mesaja Git:`, value: `[Tıkla](${`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}` || `https://discord.com/channels/${message.guild.id}/${message.channel.id}`})`, inline: true },
                        { name: `Yeni Mesaj:`, value: `\`${oldMsg || "Mesaj bulunamadı"}\`` },
                        { name: `Düzenlenen Mesaj:`, value: `\`${msg || "Mesaj bulunamadı"}\`` },
                    )
                    .setTimestamp()

                kontrol.send({ embeds: [messageUpdate] }).catch(e => { })
            } else {
                return;
            }
        }
    }

}