const { Client, EmbedBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js")
const { NAME } = require("../config.json");
module.exports = {
    name: "lock",
    description: "Bulunduğun kanalda mesaj göndermeyi kapatırsın",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🔓")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("kanalAc")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Kanalları Yönet` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true })


        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        let channelPerm = interaction.channel.guild.roles.everyone.permissionsIn(interaction.channel);

        if (!channelPerm.has([PermissionsBitField.Flags.SendMessages])) {

            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bu kanalda mesaj gönderme zaten kapatıldı.")

            return interaction.reply({ embeds: [hata], ephemeral: true }).catch(e => { })
        }

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find((role) => role.name === "@everyone"), {
            SendMessages: false,
            AddReactions: false
        });

        const lockEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `${interaction.user.tag} adlı kullanıcı tarafından istendi`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.channel}** adlı kanalda mesaj göndermeyi kapattım.`)

        interaction.reply({ embeds: [lockEmbed], components: [row] }).catch(e => { })

    }

};