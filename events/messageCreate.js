const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require('discord.js')
const { setTimeout } = require("timers");

module.exports = async (client, message) => {

    if (message.channel.type === Discord.ChannelType.DM) {
        if (message.author?.bot) return;
        setTimeout(() => {
            message.channel.send({ content: `Ah!` })
        }, 1000)

        setTimeout(() => {
            message.channel.send({ content: `noluyor..` })
        }, 3000)

        setTimeout(() => {
            message.channel.send({ content: `aaa <@${message.author.id}> dm ye hoşgeldin :3` })
        }, 7000)

        setTimeout(() => {
            message.channel.send({ content: `maalesef ben dm'den yardımcı olamıyorum, kim bilir belki bir gün olabilirim :wink:` }).then(m => {
                setTimeout(() => {
                    m.react("👋").catch((e) => { })
                }, 2000)
            })
        }, 10000)
        return;
    }

    let kufur = louritydb.get(`kufurEngel_${message.guild.id}`)
    let reklam = louritydb.get(`reklamEngel_${message.guild.id}`)
    let yasaklikelime = louritydb.get(`yasaklıKelime_${message.guild.id}`)


    if (yasaklikelime) {
        let me = message.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if (message.author?.bot) return;
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if (yasaklikelime) {
            if (yasaklikelime.some(rel => message.content.toLowerCase().includes(rel))) {
                message.delete().catch((e) => { })
            }
        }
    }


    if (kufur) {
        let me = message.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if (message.author?.bot) return;
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;


        if (kufur) {
            const kufurler = [
                "amk",
                "piç",
                "yarrak",
                "oç",
                "göt",
                "amq",
                "yavşak",
                "amcık",
                "amcı",
                "orospu",
                "sikim",
                "sikeyim",
                "aq",
                "mk",
                "sex",
                "seks",
                "sik",
                "taşşak",
                "taşak",
                "daşak",
                "daşşak",
                "siq",
                "meme",
                "g0t",
                "g*t",
                "kahpe",
                "pezevenk",
                "sürtük",
                "ibne",
                "kaltak",
                "orispi",
                "puşt",
                "porno",
                "porn",
                "sıçim",
                "sıçayım",
                "puşt",
                "ucube",
                "aptal",
                "orsp",
                "sakso",
                "saks0",
                "pipi",
                "popo"
            ]


            if (kufurler.some(rel => message.content.toLowerCase().includes(rel))) {
                message.delete().catch((e) => { })
            }
        }
    }


    if (reklam) {
        let me = message.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        if (message.author?.bot) return;
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return


        if (reklam) {
            const linkler = [

                ".com.tr",
                ".net",
                ".org",
                ".tk",
                ".cf",
                ".gf",
                "https://",
                ".gq",
                "http://",
                ".com",
                ".gg",
                ".porn",
                ".edu",
                ".xyz",
                ".fun",
                ".me",
                ".company",
                "www.",
                ".club",
                ".info",
                ".site",
                ".online",
                ".tv",
                ".de"
            ]

            if (linkler.some(rel => message.content.toLowerCase().includes(rel))) {
                message.delete().catch((e) => { })
            }
        }
    }
}