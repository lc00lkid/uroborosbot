const { Client, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const moment = require("moment");
const Discord = require("discord.js")
require("moment-duration-format");
const os = require("os");
const { NAME } = require("../config.json");
const louritydb2 = require("orio.db")

module.exports = {
  name: "istatistik",
  description: "Botun istatistiğini görüntülersin",
  type: 1,
  options: [],

  run: async (client, interaction) => {

    const row1 = new ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel("🔄")
          .setStyle(Discord.ButtonStyle.Primary)
          .setCustomId("guncelle" + interaction.user.id)
      )
      .addComponents(
        new Discord.ButtonBuilder()
          .setEmoji("1049574454520451105")
          .setStyle(Discord.ButtonStyle.Danger)
          .setCustomId("messageDelete" + interaction.user.id)
      )

    let zaman = louritydb2.get(`botAcilma_`)
    let date = `<t:${Math.floor(zaman / 1000)}:R>`
    let servers = client.guilds.cache.size

    var yes1 = servers > 100
    var yes15 = servers > 150
    var yes2 = servers > 200
    var yes25 = servers > 250
    var yes3 = servers > 300
    var yes35 = servers > 350
    var yes4 = servers > 400
    var yes45 = servers > 450
    var yes5 = servers > 500

    var basDolu = "<:basdolubar:1054410914599800843>"
    var basBos = "<:basbosbar:1054412640799182918>"
    var ortaDolu = "<:ortadolubar:1054410958811975690>"
    var ortaBos = "<:ortabosbar:1054410964948230255>"
    var sonDolu = "<:sondolubar:1054411035374788708>"
    var sonBos = "<:sonbosbar:1054411013086257272>"

    const embed = new EmbedBuilder()
      .setTitle(`${NAME} Bot | İstatistik`)
      .addFields(
        { name: "👥 Kullanıcılar", value: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`, inline: true },
        { name: "🧩 Sunucular", value: `${servers + 2}`, inline: true },
        { name: "📼 Bellek Kullanımı", value: `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2)}MB`, inline: true },
        { name: "⏳ Açılma Süresi", value: `${date}`, inline: true },
        { name: "⏺️ Ping", value: `${client.ws.ping}`, inline: true },
        { name: "📥 Oluşturulma Tarihi", value: `<t:1668343631:R>`, inline: true },
        { name: `📋 Sunucu Hedef Barı [${servers + 2}/500]`, value: `${yes1 ? `${basDolu}` : `${basBos}`}${yes15 ? `${ortaDolu}` : `${ortaBos}`}${yes2 ? `${ortaDolu}` : `${ortaBos}`}${yes25 ? `${ortaDolu}` : `${ortaBos}`}${yes3 ? `${ortaDolu}` : `${ortaBos}`}${yes35 ? `${ortaDolu}` : `${ortaBos}`}${yes4 ? `${ortaDolu}` : `${ortaBos}`}${yes45 ? `${ortaDolu}` : `${ortaBos}`}${yes5 ? `${sonDolu}` : `${sonBos}`}`, inline: true },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor("ff7063")

    const hata = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Bu komutu kullanırken bir hata oluştu, lütfen tekrar deneyin.")

    await interaction.deferReply();

    interaction.followUp({ embeds: [embed], components: [row1] }).catch(e => {
      return interaction.followUp({ embeds: [hata], ephemeral: true });
    })

  }

};