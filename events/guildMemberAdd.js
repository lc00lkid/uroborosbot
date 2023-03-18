const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")
const Discord = require("discord.js")
const names = require("../isimler.json");

module.exports = async (client, member) => {

    let yapayZekaKontrol = louritydb.get(`yapayZekaKayit_${member.guild.id}`)
    let otorol = louritydb.get(`otorol_${member.guild.id}`)

    if (yapayZekaKontrol) {
        if (otorol) {
            louritydb.delete(`otorol_${member.guild.id}`)
        }
    }

    // YENİ HESAP ENGEL 

    const yeniHesap = louritydb.get(`yeniHesapEngel_${member.guild.id}`)

    if (yeniHesap) {
        let logKanal = yeniHesap.log
        if (!logKanal) return;
        let cezalıRol = yeniHesap.rol
        if (!cezalıRol) return;
        let me = member.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        let role = member.guild.roles.cache.get(cezalıRol)

        await member.roles.add(role).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Cezalı rolü bulunamadığı için **sistem sıfırlandı.**")

            member.channel.send({ embeds: [rolEmbed] })
            louritydb.delete(`yeniHesapEngel_${member.guild.id}`)
            return;
        })

        if (role) {
            const now = new Date().getTime() - client.users.cache.get(member.id).createdAt.getTime() < 1296000000

            if (now) {
                const channel = member.guild.channels.cache.get(logKanal)

                if (!channel) {
                    louritydb.delete(`yeniHesapEngel_${member.guild.id}`)
                    return;
                }

                await member.roles.add(role)

                const logEmbed = new EmbedBuilder()
                    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`${member} adlı kullanıcı yeni hesap olduğu için cezalı rolü verildi.`)
                    .setTimestamp()
                    .setColor("Red")

                return channel.send({ embeds: [logEmbed] }).catch(l => { })
            }
        }
    };
    // YENİ HESAP ENGEL SON



    let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${member.guild.id}`)

    if (yapayZekaKayit) {

        let serverBots = member.user.bot
        if (serverBots) {
            return;
        }

        let kayitKanal = yapayZekaKayit.kayitKanal
        let erkekRol = yapayZekaKayit.erkekRol
        let kizRol = yapayZekaKayit.kizRol
        let kayitsizRol = yapayZekaKayit.kayitsizRol
        let tag = yapayZekaKayit.tag

        let channelKontrol = client.channels.cache.get(kayitKanal)

        if (!channelKontrol) {

            louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
            return;
        }

        if (!kayitsizRol) return;
        if (!erkekRol) return;
        if (!kizRol) return;

        const channel = await client.channels.cache.get(kayitKanal);

        let degace = member.guild.members.cache.get(client.user.id)

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`🤖 __Yeterli yetkim olmadığı için__ kayıt işlemini başlatamadım!`)

        if (!degace.permissions.has(PermissionsBitField.Flags.Administrator)) return channel.send({ content: `${member}`, embeds: [botYetki] })

        function KayıtEt(mesaj, isim, yas) {

            const nick = isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()

            if (names.find(data => data.name.toLocaleLowerCase() === isim.toLowerCase()).cinsiyet === "K") {

                mesaj.member.roles.add(kizRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

                mesaj.member.roles.remove(kayitsizRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

                return mesaj.member.setNickname(`${tag || ""} ${nick} | ${yas}`).catch(l => { })
            } else if (names.find(data => data.name.toLowerCase() === isim.toLowerCase()).cinsiyet === "E") {

                mesaj.member.roles.add(erkekRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

                mesaj.member.roles.remove(kayitsizRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

                return mesaj.member.setNickname(`${tag || ""} ${nick} | ${yas}`).catch(l => { })
            } else if (names.find(data => data.name.toLowerCase() === isim.toLowerCase()).cinsiyet === "U") {

                const unisexRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Erkek`)
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("erkekButton" + member.user.id)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Kız`)
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("kızButton" + member.user.id)
                    )

                const unisexEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`\`・\` Dostum ismin **unisex** bir isim olduğu için sana erkek veya kız rolü veremiyorum.\n\n\`・\` Aşağıdaki butonlara tıklayarak cinsiyetini seçebilirsin.`)

                channel.send({ embeds: [unisexEmbed], content: `${member}`, components: [unisexRow] })
                louritydb2.set(`unisex_${member.id}`, true)
                return mesaj.member.setNickname(`Unisex İsim`).catch(l => { })
            }
        };

        let registerCompleted = louritydb2.get(`registerComplete_${member.id}`)

        if (registerCompleted) {

            let registerİsim = registerCompleted.isim
            let registerYas = registerCompleted.yas

            if (names.find(data => data.name.toLowerCase() === registerİsim.toLowerCase()).cinsiyet === "U") {

                member.roles.add(kayitsizRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

                member.setNickname(`${tag || ""} ${registerİsim.charAt(0).toUpperCase() + registerİsim.slice(1).toLowerCase()} | ${registerYas}`).catch(l => { })

                let unisexCinsiyet = louritydb2.get(`unisexCinsiyet_${member.id}`)

                if (!unisexCinsiyet) return;
                if (unisexCinsiyet === 'E') {

                    member.roles.add(erkekRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })

                    member.roles.remove(kayitsizRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })
                }

                if (unisexCinsiyet === 'K') {

                    member.roles.add(kizRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })

                    member.roles.remove(kayitsizRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })
                }
            }

            const otoKayitEmbed = new EmbedBuilder()
                .setTitle("Sunucumuza hoşgeldin dostum!")
                .setDescription(`\`・\` ${member} daha önce bir sunucuda kayıt olmuşsun.\n\`・\` Bu yüzden seni **otomatik** kayıt ettim!`)
                .setColor("Green")

            member.setNickname(`${tag || ""} ${registerİsim.charAt(0).toUpperCase() + registerİsim.slice(1).toLowerCase()} | ${registerYas}`).catch(l => { })
            channel.send({ content: `${member}`, embeds: [otoKayitEmbed] })

            if (names.find(data => data.name.toLocaleLowerCase() === registerİsim.toLowerCase()).cinsiyet === "K") {

                member.roles.add(kizRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })

            } else if (names.find(data => data.name.toLowerCase() === registerİsim.toLowerCase()).cinsiyet === "E") {

                member.roles.add(erkekRol).catch(l => {

                    const rolEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

                    channel.send({ embeds: [rolEmbed] })
                    louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                    return;
                })
            }
            return
        }

        member.roles.add(kayitsizRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

            channel.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
            return;
        })
        member.setNickname("İsim | Yaş").catch(l => { })

        const kayitRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Nasıl Kayıt Olurum?`)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("kayitBilgi")
            )

        const kayitEmbed = new EmbedBuilder()
            .setTitle(`Sunucumuza hoşgeldin dostum!`)
            .setDescription(`\`・\` Kayıt işlemini başlatmak için ismini yazabilirsin.`)
            .setFooter({ text: `${member.user.tag} nasıl kayıt olacağını bilmiyorsan butona tıkla.` })
            .setColor("Yellow")

        channel.send({ embeds: [kayitEmbed], content: `${member}`, components: [kayitRow] }).then(async (message) => {

            const collector = message.channel.createMessageCollector({ time: 65000 })
            var i = 0;

            var isim;
            var yas;

            collector.on("collect", async (msg) => {
                if (msg.author.id !== member.user.id) return;

                if (i === 0) {

                    if (!names.find(data => data.name.toLowerCase() === msg.content.toLowerCase())) {
                        return msg.reply({ content: `${member} lütfen doğru bir şekilde gerçek ismini yaz.` })
                    }

                    i += 1
                    isim = msg.content

                    return msg.reply({ content: `${member} tebrikler, şimdi yaşını yaz ve işi bitir!` })
                } else if (i === 1) {
                    if (isNaN(msg.content)) return msg.reply({ content: `${member} lütfen yaşını doğru gir.` })

                    if (Number(msg.content) <= 9) {
                        return msg.reply({ content: `${member} bu kadar küçük olduğunu düşünmüyorum, gerçek yaşını girer misin?` })
                    }
                    if (Number(msg.content) >= 30) {
                        return msg.reply({ content: `${member} bu kadar büyük olduğunu düşünmüyorum, gerçek yaşını girer misin?` })
                    }

                    yas = msg.content
                    i += 1

                    collector.stop()

                    KayıtEt(msg, isim, yas)
                    louritydb2.set(`registerComplete_${member.id}`, { isim: isim, yas: yas })

                }
            })

        })
    }
};
