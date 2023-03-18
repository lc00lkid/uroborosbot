const { Client, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js")
const { NAME } = require("../config.json");
module.exports = {
    name: "yardım",
    description: "Ne yapacağını bilmiyor musun?",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("⚒️")
                    .setLabel("Moderasyon")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("mod" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("👥")
                    .setLabel("Kullanıcı")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("kullanici" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("⚙️")
                    .setLabel("Sistemler")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("sistemler" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yardim = new EmbedBuilder()
            .setAuthor({ name: `Yardım Menüsü | ${NAME}`, iconURL: client.user.displayAvatarURL() })
            .setDescription("> • Kategorilerime veya komutlarıma bakmak için aşağıdaki **butonları** kullanabilirsin.\n\n**📝 Linkler**\n> • **Davet:** [Tıkla](https://discord.com/api/oauth2/authorize?client_id=958828065381810206&permissions=8&scope=bot%20applications.commands)\n> • **Destek:** [Tıkla](https://discord.gg/HpdexYbPFY)")
            .setColor("ff7063")

        await interaction.deferReply();

        interaction.followUp({ embeds: [yardim], components: [row1] }).catch(e => { })

    }

};