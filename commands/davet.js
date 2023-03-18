const { Client, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js")
const { NAME } = require("../config.json");
module.exports = {
    name: "davet",
    description: "Sunucunu güzelleştirmek ister misin? O zaman beni davet et",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("🤖")
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=958828065381810206&permissions=8&scope=bot%20applications.commands")
                    .setLabel("Davet")
                    .setStyle(ButtonStyle.Link)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("📞")
                    .setURL("https://discord.gg/HpdexYbPFY")
                    .setLabel("Destek Sunucusu")
                    .setStyle(ButtonStyle.Link)
            )

        const yardim = new EmbedBuilder()
            .setAuthor({ name: `${NAME} botu sunucuna davet et!`, iconURL: client.user.displayAvatarURL() })
            .setDescription("Beni sunucuna davet ederek hayalindeki topluluğu oluşturabilirsin!")
            .addFields(
                { name: "\u200B", value: "🟦  /yardım", inline: true },
                { name: "\u200B", value: "🟦  /istatistik", inline: true }
            )
            .setColor("ff7063")

        await interaction.deferReply();

        interaction.followUp({ embeds: [yardim], components: [row1] })

    }

};