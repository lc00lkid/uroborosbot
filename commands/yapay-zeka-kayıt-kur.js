const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
module.exports = {
    name: "yapay-zeka-kayıt-kur",
    description: "Yapay zeka kayıt sistemini, kanallarını ve rollerini kurar",
    type: 1,
    options: [
        {
            name: "seçim",
            description: "Roller ve Kanallar emojili mi emojisiz mi olsun.",
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Emojili',
                    value: "emojili"
                },

                {
                    name: 'Emojisiz',
                    value: "emojisiz"
                }
            ]
        },
    ],

    run: async (client, interaction) => {

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!")

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })
        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })


        let input = interaction.options.getString('seçim')

        if (input === 'emojili') {

            interaction.guild.roles.create({
                name: `👨 Erkek`,
                color: "Blue",
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.MentionEveryone],
                        deny: [PermissionsBitField.Flags.ChangeNickname],
                        deny: [PermissionsBitField.Flags.EmbedLinks],
                        deny: [PermissionsBitField.Flags.AddReactions],
                    }
                ]
            }).then(erkek => {
                interaction.guild.roles.create({
                    name: `👩 Kız`,
                    color: "Red",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.MentionEveryone],
                            deny: [PermissionsBitField.Flags.ChangeNickname],
                            deny: [PermissionsBitField.Flags.EmbedLinks],
                            deny: [PermissionsBitField.Flags.AddReactions],
                        }
                    ]
                }).then(kiz => {
                    interaction.guild.roles.create({
                        name: `🔒 Kayıtsız`,
                        color: "Yellow",
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                                deny: [PermissionsBitField.Flags.MentionEveryone],
                                deny: [PermissionsBitField.Flags.ChangeNickname],
                                deny: [PermissionsBitField.Flags.EmbedLinks],
                                deny: [PermissionsBitField.Flags.AddReactions],
                            }
                        ]
                    }).then(kayitsiz => {
                        interaction.guild.channels.create({
                            name: `🔓・kayıt-kanalı`,
                            type: Discord.ChannelType.GuildText,

                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                    deny: [PermissionsBitField.Flags.AttachFiles],
                                    deny: [PermissionsBitField.Flags.AddReactions],
                                    deny: [PermissionsBitField.Flags.EmbedLinks],
                                    deny: [PermissionsBitField.Flags.MentionEveryone],
                                    deny: [PermissionsBitField.Flags.UseApplicationCommands],
                                },
                                {
                                    id: erkek.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                },
                                {
                                    id: kiz.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                }
                            ]
                        }).then(kayitKanal => {
                            louritydb.set(`yapayZekaKayit_${interaction.guild.id}`, { kayitKanal: kayitKanal.id, erkekRol: erkek.id, kizRol: kiz.id, kayitsizRol: kayitsiz.id })

                            let data = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
                            if (!data) return;

                            const basarili = new EmbedBuilder()
                                .setColor("Green")
                                .setDescription(`Yapay zekalı kayıt sistemi kanal ve rollerle birlikte ayarlandı.`)
                                .addFields(
                                    { name: `Kayıt Kanalı`, value: `<#${data.kayitKanal}>`, inline: true },
                                    { name: `Kayıtsız Rolü`, value: `<@&${data.kayitsizRol}>`, inline: true },
                                    { name: `\u200B`, value: `\u200B`, inline: true },
                                    { name: `Erkek Rolü`, value: `<@&${data.erkekRol}>`, inline: true },
                                    { name: `Kız Rolü`, value: `<@&${data.kizRol}>`, inline: true },
                                )
                                .setFooter({ text: `${interaction.user.tag} otomatik sistemin tadını çıkar 😉` })

                            return interaction.reply({ embeds: [basarili], ephemeral: true })
                        })
                    })
                });
            })
        };

        // Emojisiz
        if (input === 'emojisiz') {

            interaction.guild.roles.create({
                name: `Erkek`,
                color: "Blue",
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.MentionEveryone],
                        deny: [PermissionsBitField.Flags.ChangeNickname],
                        deny: [PermissionsBitField.Flags.EmbedLinks],
                        deny: [PermissionsBitField.Flags.AddReactions],
                    }
                ]
            }).then(erkek => {
                interaction.guild.roles.create({
                    name: `Kız`,
                    color: "Red",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.MentionEveryone],
                            deny: [PermissionsBitField.Flags.ChangeNickname],
                            deny: [PermissionsBitField.Flags.EmbedLinks],
                            deny: [PermissionsBitField.Flags.AddReactions],
                        }
                    ]
                }).then(kiz => {
                    interaction.guild.roles.create({
                        name: `Kayıtsız`,
                        color: "Yellow",
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                                deny: [PermissionsBitField.Flags.MentionEveryone],
                                deny: [PermissionsBitField.Flags.ChangeNickname],
                                deny: [PermissionsBitField.Flags.EmbedLinks],
                                deny: [PermissionsBitField.Flags.AddReactions],
                            }
                        ]
                    }).then(kayitsiz => {
                        interaction.guild.channels.create({
                            name: `kayıt-kanalı`,
                            type: Discord.ChannelType.GuildText,

                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                    deny: [PermissionsBitField.Flags.AttachFiles],
                                    deny: [PermissionsBitField.Flags.AddReactions],
                                    deny: [PermissionsBitField.Flags.EmbedLinks],
                                    deny: [PermissionsBitField.Flags.MentionEveryone],
                                    deny: [PermissionsBitField.Flags.UseApplicationCommands],
                                },
                                {
                                    id: erkek.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                },
                                {
                                    id: kiz.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                }

                            ]
                        }).then(kayitKanal => {
                            louritydb.set(`yapayZekaKayit_${interaction.guild.id}`, { kayitKanal: kayitKanal.id, erkekRol: erkek.id, kizRol: kiz.id, kayitsizRol: kayitsiz.id })

                            let data = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
                            if (!data) return;

                            const basarili = new EmbedBuilder()
                                .setColor("Green")
                                .setDescription(`Yapay zekalı kayıt sistemi kanal ve rollerle birlikte ayarlandı.`)
                                .addFields(
                                    { name: `Kayıt Kanalı`, value: `<#${data.kayitKanal}>`, inline: true },
                                    { name: `Kayıtsız Rolü`, value: `<@&${data.kayitsizRol}>`, inline: true },
                                    { name: `\u200B`, value: `\u200B`, inline: true },
                                    { name: `Erkek Rolü`, value: `<@&${data.erkekRol}>`, inline: true },
                                    { name: `Kız Rolü`, value: `<@&${data.kizRol}>`, inline: true },
                                )
                                .setFooter({ text: `${interaction.user.tag} otomatik sistemin tadını çıkar 😉` })

                            return interaction.reply({ embeds: [basarili], ephemeral: true })
                        })
                    })
                });
            })
        };
    }

};