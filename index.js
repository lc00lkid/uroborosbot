// Discord
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");

// İNTENTS
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });

const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
// Database
const louritydb = require("croxydb")
const louritydb2 = require("orio.db")



global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs")
const { TOKEN, NAME, ERROR } = require("./config.json");
const { log, inherits } = require("util");
const { setTimeout } = require("timers");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)

// Komutlar -----------------------------------------------------------------------------------|

// Tekrar kayıt ol
client.on('interactionCreate', member => {
    if (!member.isButton()) return;
    if (member.customId === "yenidenKayit") {

        const names = require("./isimler.json");

        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${member.guild.id}`)

        if (yapayZekaKayit) {

            let erkekRol = yapayZekaKayit.erkekRol
            let kizRol = yapayZekaKayit.kizRol
            let kayitsizRol = yapayZekaKayit.kayitsizRol
            let tag = yapayZekaKayit.tag

            if (!kayitsizRol) return;
            if (!erkekRol) return;
            if (!kizRol) return;

            function KayıtEt(mesaj, isim, yas) {

                const nick = isim.charAt(0).toUpperCase() + isim.slice(1).toLowerCase()

                let rq = isim.toLocaleLowerCase().cinsiyet === "K"
                if (names.find(data => data.name.toLocaleLowerCase() === rq)) {

                    mesaj.member.roles.add(kizRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })
                    mesaj.member.roles.remove(erkekRol)


                    return mesaj.member.setNickname(`${tag || ""} ${nick} | ${yas}`)
                } else if (names.find(data => data.name.toLowerCase() === isim.toLowerCase()).cinsiyet === "E") {
                    mesaj.member.roles.add(erkekRol).catch(l => {

                        const rolEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

                        channel.send({ embeds: [rolEmbed] })
                        louritydb.delete(`yapayZekaKayit_${member.guild.id}`)
                        return;
                    })
                    mesaj.member.roles.remove(kizRol)

                    return mesaj.member.setNickname(`${tag || ""} ${nick} | ${yas}`)
                } else if (names.find(data => data.name.toLowerCase() === isim.toLowerCase()).cinsiyet === "U") {

                    const unisexRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Erkek`)
                                .setStyle(ButtonStyle.Primary)
                                .setCustomId("erkekButtonTwo" + member.user.id)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Kız`)
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId("kızButtonTwo" + member.user.id)
                        )

                    const unisexEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`\`・\` Dostum ismin **unisex** bir isim olduğu için sana erkek veya kız rolü veremiyorum.\n\n\`・\` Aşağıdaki butonlara tıklayarak cinsiyetini seçebilirsin.`)

                    member.channel.send({ embeds: [unisexEmbed], content: `<@!${member.user.id}>`, components: [unisexRow] })
                    louritydb2.set(`unisex_${member.user.id}`, true)
                    return mesaj.member.setNickname(`Unisex İsim`)
                }
            };

            const kayitEmbed = new EmbedBuilder()
                .setTitle(`Sunucumuza hoşgeldin dostum!`)
                .setDescription(`\`・\` Kayıt işlemini başlatmak için ismini yazabilirsin.`)
                .setFooter({ text: `${member.user.tag} nasıl kayıt olacağını bilmiyorsan butona tıkla.` })
                .setColor("Yellow")

            member.channel.send({ embeds: [kayitEmbed], ephemeral: true }).then(async (message) => {

                const collector = message.channel.createMessageCollector({ time: 65000 })
                var i = 0;

                var isim;
                var yas;

                collector.on("collect", async (msg) => {
                    if (msg.author.id !== member.user.id) return;

                    if (i === 0) {

                        if (!names.find(data => data.name.toLowerCase() === msg.content.toLowerCase())) {
                            return msg.reply({ content: `<@!${member.user.id}> lütfen doğru bir şekilde gerçek ismini yaz.` })
                        }

                        i += 1
                        isim = msg.content

                        return msg.reply({ content: `<@!${member.user.id}> tebrikler, şimdi yaşını yaz ve işi bitir!` })
                    } else if (i === 1) {
                        if (isNaN(msg.content)) return msg.reply({ content: `<@!${member.user.id}> lütfen yaşını doğru gir.` })

                        if (Number(msg.content) <= 9) {
                            return msg.reply({ content: `<@!${member.user.id}> bu kadar küçük olduğunu düşünmüyorum, gerçek yaşını girer misin?` })
                        }
                        if (Number(msg.content) >= 30) {
                            return msg.reply({ content: `<@!${member.user.id}> bu kadar büyük olduğunu düşünmüyorum, gerçek yaşını girer misin?` })
                        }

                        yas = msg.content
                        i += 1

                        collector.stop()

                        KayıtEt(msg, isim, yas)
                        if (!names.find(data => data.name.toLowerCase() === isim.toLowerCase()).cinsiyet === "U") {
                            const basarili = new EmbedBuilder()
                                .setColor("Green")
                                .setDescription(`:tada: Kayıt başarıyla tamamlandı, iyi eğlenceler!`)

                            msg.reply({ embeds: [basarili] })
                        }
                        louritydb2.set(`registerComplete_${member.user.id}`, { isim: isim, yas: yas })

                    }
                })
            })
        }
    }
})
    .setMaxListeners(90)
// Unisex Kayıt || Yapay zeka kayıt
// ERKEK
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "erkekButtonTwo" + interaction.user.id) {

        const data = louritydb2.fetch(`unisex_${interaction.member.id}`)
        if (!data) return;
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        if (!yapayZekaKayit) return;
        let kayitKanal = yapayZekaKayit.kayitKanal
        let erkekRol = yapayZekaKayit.erkekRol
        let kizRol = yapayZekaKayit.kizRol
        let register = louritydb2.get(`registerComplete_${interaction.member.id}`)
        if (!register) return;
        let nick = register.isim
        let yas = register.yas
        let tag = yapayZekaKayit.tag

        let channelKontrol = client.channels.cache.get(kayitKanal)
        if (!channelKontrol) return;

        interaction.member.roles.add(erkekRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.roles.remove(kizRol)

        interaction.member.setNickname(`${tag || ""} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} | ${yas}`)

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:tada: Kayıt başarıyla tamamlandı, iyi eğlenceler!`)

        interaction.reply({ embeds: [basarili] });

        louritydb2.delete(`unisex_${interaction.member.id}`);
        return louritydb2.set(`unisexCinsiyet_${interaction.member.id}`, "E")

    }
});

// KIZ
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "kızButtonTwo" + interaction.user.id) {

        const data = louritydb2.fetch(`unisex_${interaction.member.id}`)
        if (!data) return;
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        if (!yapayZekaKayit) return;
        let kayitKanal = yapayZekaKayit.kayitKanal
        let kizRol = yapayZekaKayit.kizRol
        let erkekRol = yapayZekaKayit.erkekRol
        let register = louritydb2.get(`registerComplete_${interaction.member.id}`)
        if (!register) return;
        let nick = register.isim
        let yas = register.yas
        let tag = yapayZekaKayit.tag

        let channelKontrol = client.channels.cache.get(kayitKanal)
        if (!channelKontrol) return;

        interaction.member.roles.add(kizRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.roles.remove(erkekRol)

        interaction.member.setNickname(`${tag || ""} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} ${yas}`)

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:tada: Kayıt başarıyla tamamlandı, iyi eğlenceler!`)

        interaction.reply({ embeds: [basarili] });

        louritydb2.delete(`unisex_${interaction.member.id}`)
        return louritydb2.set(`unisexCinsiyet_${interaction.member.id}`, "K");
    }
});

// AYRI KAYIT ----------------------------------------------------------------------------------

// ERKEK
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "erkekButton" + interaction.user.id) {

        const data = louritydb2.fetch(`unisex_${interaction.member.id}`)
        if (!data) return;
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        if (!yapayZekaKayit) return;
        let kayitKanal = yapayZekaKayit.kayitKanal
        let erkekRol = yapayZekaKayit.erkekRol
        let kayitsizRol = yapayZekaKayit.kayitsizRol
        let register = louritydb2.get(`registerComplete_${interaction.member.id}`)
        if (!register) return;
        let nick = register.isim
        let yas = register.yas
        let tag = yapayZekaKayit.tag

        let channelKontrol = client.channels.cache.get(kayitKanal)
        if (!channelKontrol) return;

        interaction.member.roles.add(erkekRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **erkek** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.roles.remove(kayitsizRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.setNickname(`${tag || ""} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} | ${yas}`)

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:tada: Kayıt başarıyla tamamlandı, iyi eğlenceler!`)

        interaction.reply({ embeds: [basarili] });

        louritydb2.delete(`unisex_${interaction.member.id}`);
        return louritydb2.set(`unisexCinsiyet_${interaction.member.id}`, "E")

    }
});

// KIZ
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "kızButton" + interaction.user.id) {

        const data = louritydb2.fetch(`unisex_${interaction.member.id}`)
        if (!data) return;
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        if (!yapayZekaKayit) return;
        let kayitKanal = yapayZekaKayit.kayitKanal
        let kizRol = yapayZekaKayit.kizRol
        let kayitsizRol = yapayZekaKayit.kayitsizRol
        let register = louritydb2.get(`registerComplete_${interaction.member.id}`)
        if (!register) return;
        let nick = register.isim
        let yas = register.yas
        let tag = yapayZekaKayit.tag

        let channelKontrol = client.channels.cache.get(kayitKanal)
        if (!channelKontrol) return;

        interaction.member.roles.add(kizRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **kız** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.roles.remove(kayitsizRol).catch(l => {

            const rolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Yapay zeka sistemindeki **kayıtsız** rolü bulunamadığı için **sistem sıfırlandı.**")

            channelKontrol.send({ embeds: [rolEmbed] })
            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)
            return;
        })

        interaction.member.setNickname(`${tag || ""} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()} | ${yas}`)

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:tada: Kayıt başarıyla tamamlandı, iyi eğlenceler!`)

        interaction.reply({ embeds: [basarili] });

        louritydb2.delete(`unisex_${interaction.member.id}`)
        return louritydb2.set(`unisexCinsiyet_${interaction.member.id}`, "K");
    }
});

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "kayitBilgi") {

        const kayitBilgiEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setTitle("Nasıl Kayıt Olurum?")
            .setDescription("Aşağıdaki görsele bakarak kolaylıkla kayıt olabilirsin.")
            .setImage("https://media.discordapp.net/attachments/1016663875342569562/1039940423529025618/degaceKayit.png")

        return interaction.reply({ embeds: [kayitBilgiEmbed], ephemeral: true }).catch(e => { })

    }
})

// Sunucu Bilgi
client.on('interactionCreate', message => {
    if (!message.isButton()) return;

    if (message.customId === "guncelle2" + message.user.id) {
        const server = message.guild

        let serverSize = server.memberCount;
        let botCount = server.members.cache.filter(m => m.user.bot).size;;
        let aktif = server.members.cache.filter(member => member.presence && (member.presence.status != "offline")).size
        const owner = server.members.cache.get(server.ownerId);

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " gün" : " gün") + " önce";
        }

        const serverİnfoEmbed = new EmbedBuilder()
            .setAuthor({ name: `${server.name} Sunucu Bilgileri` })
            .addFields(
                { name: "Sunucu Kuruluş:", value: `📅 \`${checkDays(server.createdAt)}\``, inline: true },
                { name: "Sunucu Sahibi:", value: `${owner}`, inline: true },
                { name: "Kanallar:", value: `#️⃣ \`${server.channels.cache.size}\`` },
                { name: `Tüm Kullanıcılar [${serverSize}]`, value: `👥 **${serverSize - botCount}** | 🤖 **${botCount}** | 🟢 **${aktif}**` },
            )
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setColor("ff7063")

        message.update({ embeds: [serverİnfoEmbed] }).catch(e => { })

    }
    // İstatistik
    if (message.customId === "guncelle" + message.user.id) {

        const moment = require("moment");
        require("moment-duration-format");
        const os = require("os");

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

        message.update({ embeds: [embed] }).catch(e => { })

    }
})


//Yardım menüsü
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "mod" + interaction.user.id) {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🏡")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("ev" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("◀️")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("mod" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("▶️")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("mod2" + interaction.user.id)
            )

        const yardimMod = new EmbedBuilder()
            .setAuthor({ name: `Moderasyon [1-2] | ${NAME}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: "🟥 /küfür-engel", value: "Küfür engel sistemini ayarlarsınız.", inline: true },
                { name: "🟥 /reklam-engel", value: "Reklam engel sistemini ayarlarsınız.", inline: true },
                { name: "🟥 /yasaklı-kelime", value: "Sunucuda kullanılmasını istemediğin kelimeleri ayarlarsın.", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "🟥 /hoşgeldin-sistemi", value: "Hoşgeldin sistemini ayarlarsınız.", inline: true },
                { name: "🟥 /otorol", value: "Otorol sistemini ayarlarsınız.", inline: true },
                { name: "🟥 /ayarlar", value: "Sunucu ayarlarına bakarsınız.", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "🟥 /timeout", value: "Kullanıcıyı sunucuda susturursun.", inline: true },
                { name: "🟥 /untimeout", value: "Kullanıcının susturmasını kaldırırsın.", inline: true },
                { name: "🟥 /buton-rol", value: "Üyelerin butona basarak rol almasını sağlarsın.", inline: true },
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("ff7063")
        interaction.update({ embeds: [yardimMod], components: [row1] })

    }

    if (interaction.customId === "mod2" + interaction.user.id) {

        const yardimMod = new EmbedBuilder()
            .setAuthor({ name: `Moderasyon [2-2] | ${NAME}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: "🟥 /ban", value: "Kullanıcıyı sunucudan yasaklarsın.", inline: true },
                { name: "🟥 /nuke", value: "Kanaldaki tüm mesajları silersin.", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "🟥 /lock", value: "Bulunduğun kanalda mesaj göndermeyi kapatırsın.", inline: true },
                { name: "🟥 /unlock", value: "Bulunduğun kanalda mesaj göndermeyi açarsın.", inline: true },
                { name: "🟥 /sil", value: "Sohbette belirtilen miktar kadar mesaj silersin.", inline: true },
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("ff7063")
        interaction.update({ embeds: [yardimMod] })

    }

    if (interaction.customId === "ev" + interaction.user.id) {

        const roww = new ActionRowBuilder()
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
            .setAuthor({ name: `${NAME} Yardım`, iconURL: client.user.displayAvatarURL() })
            .setDescription("> • Kategorilerime veya komutlarıma bakmak için aşağıdaki **butonları** kullanabilirsin.\n\n**📝 Linkler**\n> • **Davet:** [Tıkla](https://discord.com/api/oauth2/authorize?client_id=958828065381810206&permissions=8&scope=bot%20applications.commands)\n> • **Destek:** [Tıkla](https://discord.gg/HpdexYbPFY)")
            .setColor("ff7063")
        interaction.update({ embeds: [yardim], components: [roww] }).catch(e => { })

    }

    if (interaction.customId === "kullanici" + interaction.user.id) {


        const yardimMod = new EmbedBuilder()
            .setAuthor({ name: `Kullanıcı | ${NAME}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: "🟦 /istatistik", value: "Botun istatistiklerine bakarsınız.", inline: true },
                { name: "🟦 /sunucu", value: "Sunucu hakkında bilgi alırsınız.", inline: true },
                { name: "🟦 /davet", value: "Botu sunucunuza eklersiniz.", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "🟦 /avatar", value: "Avatarını veya başkasının avatarını görüntülersiniz.", inline: true },
                { name: "🟦 /canlı-destek", value: "Canlı destek açarsınız.", inline: true },
                { name: "🟦 /kayıt-isim-sıfırla", value: "Yapay zeka kayıt sistemindeki isminizi sıfırlarsınız.", inline: true },
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("ff7063")
        interaction.update({ embeds: [yardimMod] })

    }

    if (interaction.customId === "sistemler" + interaction.user.id) {

        const row = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🏡")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setCustomId("ev" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Yapay Zeka Kayıt")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("yapayZekaButton" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Log")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("logButton" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Destek")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("destekSistemi" + interaction.user.id)
            )

        const yardimMod = new EmbedBuilder()
            .setAuthor({ name: `Sistemler | ${NAME}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: "Yapay Zeka Kayıt", value: "Yapay zeka kayıt sistemi ile sunucuna otomatik kayıt sistemi kur!", inline: true },
                { name: "Log", value: "Sunucuda olup bitenleri kayıt eder.", inline: true },
                { name: "Destek", value: "Üyelerin sunucunda özel yardım almasını sağlarsın.", inline: true },
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("ff7063")
            .setFooter({ text: "Sistemlerin tanıtımını görmek için butonlara tıklayın." })
        interaction.update({ embeds: [yardimMod], components: [row] })

    }

    if (interaction.customId === "yapayZekaButton" + interaction.user.id) {

        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)

        const yapayZekaEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setDescription("> • Yapay zekalı kayıt sistemimiz ile **otomatik** bir şekilde üyelerin sunucunuza kayıt olmasını sağlayın!")
            .setImage("https://media.discordapp.net/attachments/1016663875342569562/1039940423529025618/degaceKayit.png")
            .addFields(
                { name: "Kayıt Kanallarını Kur", value: "/yapay-zeka-kayıt-kur", inline: true },
                { name: "Kayıt Sistemini Kur", value: "/yapay-zeka-kayıt", inline: true },
            )
            .setFooter({ text: `• Kayıt sistemi şuanda sunucunuzda ${yapayZekaKayit ? "açık." : "kapalı."}` })

        return interaction.reply({ embeds: [yapayZekaEmbed], ephemeral: true }).catch(e => { })

    }

    if (interaction.customId === "logButton" + interaction.user.id) {

        let mesajLog = louritydb.get(`mesajLog_${interaction.guild.id}`)
        let kanalLog = louritydb.get(`kanalLog_${interaction.guild.id}`)

        const logEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setDescription("> • Log sistemleri ile sunucunuzda olup bitenleri görebilirsin.")
            .setImage("https://media.discordapp.net/attachments/1016663875342569562/1040920912561721344/degaceLog.png")
            .addFields(
                { name: "Mesaj Log", value: "/mesaj-log", inline: true },
                { name: "Kanal Log", value: "/kanal-log", inline: true },
                { name: "Rol Log", value: "/rol-log", inline: true },
            )
            .setFooter({ text: `• Log sistemi şuanda sunucunuzda ${mesajLog || kanalLog ? "açık." : "kapalı."}` })

        return interaction.reply({ embeds: [logEmbed], ephemeral: true }).catch(e => { })

    }

    if (interaction.customId === "destekSistemi" + interaction.user.id) {

        let destekSistemi = louritydb.get(`destekSistemi_${interaction.guild.id}`)

        const logEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setTitle("Sistem daha da geliştirilecektir.")
            .setDescription("> • Destek sistemi ile üyelerin sunucunuzda özel olarak yardım almasını sağlayın!")
            .setImage("https://media.discordapp.net/attachments/1016663875342569562/1042550046496935998/DestekSistemi.png?width=429&height=182")
            .addFields(
                { name: "Destek Sistemi", value: "/destek-sistemi", inline: true },
                { name: "Destek Ayarlar", value: "/destek-ayarlar", inline: true },
            )
            .setFooter({ text: `• Destek sistemi şuanda sunucunuzda ${destekSistemi ? "açık." : "kapalı."}` })

        return interaction.reply({ embeds: [logEmbed], ephemeral: true }).catch(e => { })

    }
})


// Otorol sistemi
client.on("guildMemberAdd", member => {
    let otorol = louritydb.get(`otorol_${member.guild.id}`)
    if (!otorol) return;

    let me = member.guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let uyeRol = otorol.uye
    let botRol = otorol.bot

    let botKontrol = member.user.bot;

    if (!botKontrol) {
        member.guild.members.cache.get(member.id).roles.add(uyeRol).catch(e => { })

        let logChannel = otorol.log
        const channel = member.guild.channels.cache.get(logChannel)
        if (!channel) return;
        if (logChannel) {
            const uyeEmbed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`📥 ${member} sunucuya giriş yaptı\n\n> <:plus:1049570579465912361> <@&${uyeRol || "bulunamadı"}> __rolü üye'ye verildi__`)
                .setThumbnail(member.user.avatarURL({ dynamic: true }) || "https://media.discordapp.net/attachments/1016663875342569562/1053618906083893269/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png?width=324&height=324")
                .setFooter({ text: `Otorol Sistemi` })
                .setTimestamp()

            return channel.send({ embeds: [uyeEmbed] });
        }
    }

    if (botKontrol) {
        member.guild.members.cache.get(member.id).roles.add(botRol).catch(e => { })

        let logChannel = otorol.log
        const channel = member.guild.channels.cache.get(logChannel)
        if (!channel) return;
        if (logChannel) {
            const botEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`📥 ${member} sunucuya giriş yaptı\n\n> <:plus:1049570579465912361> <@&${botRol || "bulunamadı"}> __rolü bot'a verildi__`)
                .setThumbnail(member.user.avatarURL() || "https://media.discordapp.net/attachments/1016663875342569562/1053618906083893269/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png?width=324&height=324")
                .setFooter({ text: `Otorol Sistemi` })
                .setTimestamp()

            return channel.send({ embeds: [botEmbed] });
        }
    }
})

// Hoşgeldin sistemi
// Embedli
client.on('guildMemberAdd', member => {

    const kontrol = louritydb.get(`hosgeldinKanal_${member.guild.id}`)
    if (!kontrol) return;

    let me = member.guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let kanal = kontrol.kanal
    let mesaj = kontrol.mesaj
    let channel = client.channels.cache.get(kanal)

    if (!channel) {
        louritydb.delete(`hosgeldinKanal_${member.guild.id}`)
        return;
    }

    if (!kanal) return;

    if (mesaj === true) {

        const server = member.guild

        const hosgeldinMesaj = new EmbedBuilder()
            .setTitle("Biri Sunucuya Katıldı!")
            .setDescription(`📥 <@!${member.id}> sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`)
            .setColor("Green")
            .setFooter({ text: `${server.name}` })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        member.guild.channels.cache.get(kanal).send({ embeds: [hosgeldinMesaj] }).catch(e => { })
    } else {
        return;
    }
})

client.on('guildMemberRemove', member => {

    const kontrol = louritydb.get(`hosgeldinKanal_${member.guild.id}`)
    if (!kontrol) return;

    let me = member.guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let kanal = kontrol.kanal
    let mesaj = kontrol.mesaj
    let channel = client.channels.cache.get(kanal)

    if (!channel) {
        louritydb.delete(`hosgeldinKanal_${member.guild.id}`)
        return;
    }
    if (!kanal) return;

    if (mesaj === true) {

        const server = member.guild

        const hosgeldinMesaj = new EmbedBuilder()
            .setTitle("Biri Sunucudan Ayrıldı!")
            .setDescription(`📤 <@!${member.id}> sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi kaldı.`)
            .setColor("Red")
            .setFooter({ text: `${server.name}` })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        member.guild.channels.cache.get(kanal).send({ embeds: [hosgeldinMesaj] }).catch(e => { })
    } else {
        return;
    }
})

// Embedsiz
client.on('guildMemberAdd', member => {

    const kontrol = louritydb.get(`hosgeldinKanal_${member.guild.id}`)
    if (!kontrol) return;

    let me = member.guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let kanal = kontrol.kanal
    let mesaj = kontrol.mesaj
    let channel = client.channels.cache.get(kanal)

    if (!channel) {
        louritydb.delete(`hosgeldinKanalEmbedsiz_${member.guild.id}`)
        return;
    }

    if (!kanal) return;
    if (mesaj === false) {
        member.guild.channels.cache.get(kanal).send({ content: `📥 ${member} sunucumuza katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.` }).catch(e => { })
    } else {
        return;
    }
})

client.on('guildMemberRemove', member => {

    const kontrol = louritydb.get(`hosgeldinKanal_${member.guild.id}`)
    if (!kontrol) return;

    let me = member.guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    let kanal = kontrol.kanal
    let mesaj = kontrol.mesaj
    let channel = client.channels.cache.get(kanal)

    if (!channel) {
        louritydb.delete(`hosgeldinKanalEmbedsiz_${member.guild.id}`)
        return;
    }
    if (!kanal) return;

    if (mesaj === false) {
        member.guild.channels.cache.get(kanal).send({ content: `📤 <@!${member.id}> sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi kaldı.` }).catch(e => { })
    } else {
        return;
    }
})


// Ayarlar güncelle
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "ayarlarRes" + interaction.user.id) {

        const server = interaction.guild

        let kufurEngel = louritydb.get(`kufurEngel_${interaction.guild.id}`)
        let reklamEngel = louritydb.get(`reklamEngel_${interaction.guild.id}`)
        let otorol = louritydb.get(`otorol_${interaction.guild.id}`)
        let hosgeldin = louritydb.get(`hosgeldinKanal_${interaction.guild.id}`)
        let yapayZekaKayit = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
        let yeniHesapEngel = louritydb.get(`yeniHesapEngel_${interaction.guild.id}`)
        let destekSistemi = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        let mesajLog = louritydb.get(`mesajLog_${interaction.guild.id}`)
        let kanalLog = louritydb.get(`kanalLog_${interaction.guild.id}`)
        let rolLog = louritydb.get(`rolLog_${interaction.guild.id}`)

        const serverSettingsEmbed = new EmbedBuilder()
            .setAuthor({ name: `${server.name} | Sunucu Ayarları`, iconURL: server.iconURL({ dynamic: true }) })
            .addFields(
                { name: "🤬 küfür-engel", value: `${kufurEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🔗 reklam-engel", value: `${reklamEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🧷 otorol", value: `${otorol ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "📥 hoşgeldin-sistemi", value: `${hosgeldin ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "💾 mesaj-log", value: `${mesajLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "#️⃣ kanal-log", value: `${kanalLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🏷️ rol-log", value: `${rolLog ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🤖 yapay-zeka-kayıt", value: `${yapayZekaKayit ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🎫 destek-sistemi", value: `${destekSistemi ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
                { name: "🛡️ yeni-hesap-engel", value: `${yeniHesapEngel ? "`🟩 Aktif`" : "`🟥 Deaktif`"}`, inline: true },
            )
            .setThumbnail(server.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
            .setColor("ff7063")

        interaction.update({ embeds: [serverSettingsEmbed] })
    }

    //Ayarlar güncelleme
    if (interaction.customId === "SunucuGuncelle" + interaction.user.id) {

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

        interaction.update({ embeds: [serverİnfoEmbed] }).catch(e => { })
    }
})

// Mesajı sil

client.on('interactionCreate', async message => {
    if (!message.isButton()) return;
    if (message.customId === "messageDelete") {
        await message.deferUpdate()
        if (message.message.author.id !== message.author.id) {
            message.followUp({ content: "busenindegil" })
        }
        message.message.delete().catch(e => { })

    }

    if (message.customId === "messageDelete" + message.user.id) {
        await message.deferUpdate()
        message.message.delete().catch(e => { })
    }

    if (message.customId === "BanMessageDelete" + message.user.id) {
        await message.deferUpdate()
        message.message.delete().catch(e => { })
        louritydb2.delete(`banlandi_${message.guild.id}`)
    }
})


// Bot destek sistemi
const lourityModal = new ModalBuilder()
    .setCustomId('form')
    .setTitle('Degace Bot Şikayet/Destek')
const a1 = new TextInputBuilder()
    .setCustomId('textmenu')
    .setLabel('Destek veya Şikayet Mesajını Yaz')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(10)
    .setPlaceholder('Kayıt sistemini anlamadım yardımcı olur musunuz?')
    .setRequired(true)

const dstk = new ActionRowBuilder().addComponents(a1);
lourityModal.addComponents(dstk);

client.on('interactionCreate', async (interaction) => {

    if (interaction.commandName === "canlı-destek") {

        setTimeout(() => {
            louritydb2.delete(`destekKullanici_${interaction.user.id}`)
        }, 20000)

        await interaction.showModal(lourityModal);
    }
})

client.on('interactionCreate', async interaction => {

    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {

        const destekMesaj = interaction.fields.getTextInputValue("textmenu")

        let kullanici = louritydb2.get(`destekKullanici_${interaction.user.id}`)

        let logKanal = "1037309121143259146"
        let channelKontrol = client.channels.cache.get(logKanal)

        const inviteURL = await interaction.channel.createInvite({ maxAge: 172800 })
        const row1 = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Sunucuya Git")
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(`${inviteURL}`)
            )

            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🟩")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId("bildirimOnayla")
            )

            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("🗑️")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("bildirimSil")
            )

        if (!kullanici) return;

        const ayarlandi = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`Destek ekibimize başarıyla yardım mesajınız gitti, en kısa sürede gelecekler!`)

        await interaction.deferReply({ ephemeral: true });

        interaction.followUp({ embeds: [ayarlandi], ephemeral: true }).catch(e => {
            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Bunu yapmaya çalışırken bir hatayla karşılaştım.`)

            return interaction.followUp({ embeds: [hata] })
        })

        const destekMesajEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`Bir sunucuda sorun olmuş!`)
            .setDescription(`<@!${kullanici || "Veri çekilemedi"}> adlı kullanıcı bir destek isteğinde bulundu!\n\n\`${destekMesaj || "veri çekilemedi"}\``)

        channelKontrol.send({ embeds: [destekMesajEmbed], components: [row1] }).catch(e => { })

    }
});

client.on('interactionCreate', message => {
    if (!message.isButton()) return;

    if (message.customId === "bildirimOnayla") {

        const onaylandi = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Bu bildirim onaylandı!")
            .setDescription(`${message.user.tag} adlı yetkili tarafından onaylandı.`)

        message.update({ embeds: [onaylandi], components: [] }).catch(e => { })
        louritydb2.delete(`destekKullanici_${message.user.id}`)
    }

    if (message.customId === "bildirimSil") {

        const silindi = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Bu bildirim silindi!")
            .setDescription(`${message.user.tag} adlı yetkili tarafından silindi.`)

        message.update({ embeds: [silindi], components: [] }).catch(e => { })
        louritydb2.delete(`destekKullanici_${message.user.id}`)
    }
})


// Sistem Sıfırlama
client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === "a1") {
        if (interaction.values[0] == "hosgeldinSistemi") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`hosgeldinKanal_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Hoşgeldin sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`hosgeldinKanal_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "otorolSistemi") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`otorol_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Otorol sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`otorol_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "kufurEngelSistemi") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`kufurEngel_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Küfür engel sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`kufurEngel_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "reklamEngelSistemi") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`reklamEngel_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Reklam engel sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`reklamEngel_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "mesajLog") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`mesajLog_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Mesaj log sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`mesajLog_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "kanalLog") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`kanalLog_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Kanal log sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`kanalLog_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "rolLog") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`rolLog_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Rol log sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`rolLog_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "yapayZekaKayit") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Yönetici` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`yapayZekaKayit_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Yapay zeka kayıt sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`yapayZekaKayit_${interaction.guild.id}`)

        }

        if (interaction.values[0] == "destekSistemi") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Yönetici` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
            if (!destek) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Destek sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })


            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)

            if (channel) {
                const msg = await channel.messages.fetch(mesaj).catch((e) => { })
                if (msg) {
                    msg.delete().catch((e) => { })
                }
            }
            louritydb.delete(`destekSistemi_${interaction.guild.id}`)
            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
        }

        if (interaction.values[0] == "yeniHesapEngel") {

            const yetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için `Yönetici` yetkisine sahip olmalısın!")

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true })

            const kontrolEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sistem zaten sıfırlanmış dostum.")

            let kontrol = louritydb.get(`yeniHesapEngel_${interaction.guild.id}`)
            if (!kontrol) return interaction.reply({ embeds: [kontrolEmbed], ephemeral: true })

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Yeni hesap engel sistemi başarıyla sıfırlandı.")

            interaction.reply({ embeds: [basarili], ephemeral: true })

            louritydb.delete(`yeniHesapEngel_${interaction.guild.id}`)

        }
    }
});

client.on("interactionCreate", async interaction => {
    //nuke
    if (interaction.customId === "nukeEvet" + interaction.user.id) {

        let channel = interaction.channel

        if (!channel.type === Discord.ChannelType.GuildText) {
            interaction.message.delete().catch(e => { })
            return interaction.reply({ embeds: [hata], ephemeral: true })
        }

        if (channel.type === Discord.ChannelType.GuildText) {

            const hata1 = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yaparken bir hatayla karşılaştım.")

            interaction.channel.clone({ name: channel.name, permissions: channel.withPermissions, topic: channel.topic, bitrate: this.bitrate }).catch(e => {

                interaction.message.delete().catch(e => { })
                return interaction.reply({ embeds: [hata1], ephemeral: true })
            })
            interaction.channel.delete().catch(e => {

                interaction.message.delete().catch(e => { })
                return interaction.reply({ embeds: [hata1], ephemeral: true })
            })

        } else {
            const hata2 = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yaparken bir hatayla karşılaştım.")

            interaction.message.delete().catch(e => { })
            return interaction.reply({ embeds: [hata2], ephemeral: true })
        }
    }

    if (interaction.customId === "nukeHayır" + interaction.user.id) {

        const hayirEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Kanaldaki mesajları silme işlemi sonlandırıldı.")

        interaction.message.delete().catch((e) => { })
        interaction.reply({ embeds: [hayirEmbed], ephemeral: true }).catch(e => { })
    }

    //lock komutu
    if (interaction.customId === "kanalAc") {

        const row = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu butonu kullanabilmek için `Kanalları Yönet` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        let channelPerm = interaction.channel.guild.roles.everyone.permissionsIn(interaction.channel);

        if (channelPerm.has([PermissionsBitField.Flags.SendMessages])) {

            interaction.message.delete().catch((e) => { })
            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bu kanalda mesaj gönderme zaten açık.")

            return interaction.reply({ embeds: [hata], ephemeral: true }).catch(e => { })
        }

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find((role) => role.name === "@everyone"), {
            SendMessages: true,
            AddReactions: true
        });

        const acildi = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.tag} adlı kullanıcı tarafından istendi`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.channel}** adlı kanalda mesaj gönderme açıldı.`)

        interaction.update({ embeds: [acildi], components: [row] }).catch(e => { })

    }

    if (interaction.customId === "kanalKilit") {

        const row = new ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const yetki = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu butonu kullanabilmek için `Kanalları Yönet` yetkisine sahip olmalısın!")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true })

        let channelPerm = interaction.channel.guild.roles.everyone.permissionsIn(interaction.channel);

        if (!channelPerm.has([PermissionsBitField.Flags.SendMessages])) {

            interaction.message.delete().catch((e) => { })
            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bu kanalda mesaj gönderme zaten kapatıldı.")

            return interaction.reply({ embeds: [hata], ephemeral: true }).catch(e => { })
        }

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find((role) => role.name === "@everyone"), {
            SendMessages: false,
            AddReactions: false
        });

        const kapatildi = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `${interaction.user.tag} adlı kullanıcı tarafından istendi`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**${interaction.channel}** adlı kanalda mesaj gönderme kapatıldı.`)

        interaction.update({ embeds: [kapatildi], components: [row] }).catch(e => { })

    }
});

// Yasaklı kelime ayarlama
const lourityModal2 = new ModalBuilder()
    .setCustomId('ekleForm')
    .setTitle('Kelime Ekle')
const u1 = new TextInputBuilder()
    .setCustomId('kelime')
    .setLabel('Ekleyeceğiniz kelimeyi yazın')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(1)
    .setMaxLength(20)
    .setPlaceholder('Lütfen sonunda boşluk bırakmadan bir kelime girin')
    .setRequired(true)

const row1 = new ActionRowBuilder().addComponents(u1);
lourityModal2.addComponents(row1);

const lourityModal3 = new ModalBuilder()
    .setCustomId('silForm')
    .setTitle('Kelime Sil')
const u2 = new TextInputBuilder()
    .setCustomId('kelime1')
    .setLabel('Sileceğiniz kelimeyi yazın')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(1)
    .setMaxLength(20)
    .setPlaceholder('Lütfen sonunda boşluk bırakmadan bir kelime girin')
    .setRequired(true)

const row2 = new ActionRowBuilder().addComponents(u2);
lourityModal3.addComponents(row2);

client.on('interactionCreate', async interaction => {

    if (interaction.customId === "kelimeEkle" + interaction.user.id) {
        await interaction.showModal(lourityModal2);
    }

    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'ekleForm') {

        const kelime = interaction.fields.getTextInputValue("kelime")
        let kelimeKontrol = louritydb.get(`yasaklıKelime_${interaction.guild.id}`)

        if (!kelimeKontrol) {

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`\`${kelime}\` başarıyla yasaklı kelime olarak eklendi.`)

            louritydb.push(`yasaklıKelime_${interaction.guild.id}`, kelime)
            return interaction.reply({ embeds: [basarili], ephemeral: true });
        }

        try {

            if (kelimeKontrol.includes(kelime)) {

                const hataEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("Girilen kelime zaten mevcut.")

                await interaction.reply({ embeds: [hataEmbed], ephemeral: true })
            }

            if (!kelimeKontrol.includes(kelime)) {

                louritydb.push(`yasaklıKelime_${interaction.guild.id}`, kelime)
                const basarili = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`\`${kelime}\` başarıyla yasaklı kelime olarak eklendi.`)

                return interaction.reply({ embeds: [basarili], ephemeral: true });
            }

        } catch {
            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Kelime eklerken bir sorun oluştu.")

            return interaction.reply({ embeds: [hata], ephemeral: true })
        }
    }
});

// Sil
client.on('interactionCreate', async interaction => {

    if (interaction.customId === "kelimeSil" + interaction.user.id) {
        await interaction.showModal(lourityModal3);
    }

    if (interaction.customId === "kelimeler" + interaction.user.id) {

        let kelimeler = louritydb.get(`yasaklıKelime_${interaction.guild.id}`)

        if (!kelimeler) {
            const hataEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sunucuda hiç yasaklı kelime bulunmuyor.")

            return interaction.reply({ embeds: [hataEmbed], ephemeral: true })
        }

        if (kelimeler === []) {
            const hataEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sunucuda hiç yasaklı kelime bulunmuyor.")

            return interaction.reply({ embeds: [hataEmbed], ephemeral: true })
        }

        const kelimelerEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Yasaklı Kelimeler")
            .setDescription(`> \`${kelimeler || "Sunucuda hiç yasaklı kelime bulunmuyor."}\``)

        return interaction.reply({ embeds: [kelimelerEmbed], ephemeral: true })
    }

    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'silForm') {

        const kelime = interaction.fields.getTextInputValue("kelime1")

        let yasakliKelime = louritydb.get(`yasaklıKelime_${interaction.guild.id}`)

        if (!yasakliKelime) {

            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Sunucuda hiç yasaklı kelime bulunmuyor.")

            return interaction.reply({ embeds: [hata], ephemeral: true })
        }

        if (!yasakliKelime.includes(kelime)) {

            const hata = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Engellenmemiş bir kelime girdin.")

            return interaction.reply({ embeds: [hata], ephemeral: true })
        }

        let kelimeKontrol = louritydb.get(`yasaklıKelime_${interaction.guild.id}`)

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Belirtilen yasaklı kelime başarıyla silindi.`)

        louritydb.unpush(`yasaklıKelime_${interaction.guild.id}`, kelime)
        interaction.reply({ embeds: [basarili], ephemeral: true })

        if (kelimeKontrol.length <= 1) {
            return louritydb.delete(`yasaklıKelime_${interaction.guild.id}`)
        }
    }
});


// Buton rol sistemi
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "butonRol") {

        let rol = louritydb.get(`butonRol_${interaction.guild.id}`)
        if (!rol) return;
        let lourity = interaction.guild.members.cache.get(client.user.id)

        const botYetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

        if (!lourity.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [botYetki], ephemeral: true })

        if (!interaction.member.roles.cache.has(rol)) {

            interaction.member.roles.add(rol).catch(e => { })

            const verildi = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`<@&${rol}> adlı rol başarıyla üzerine verildi!`)

            return interaction.reply({ embeds: [verildi], ephemeral: true }).catch((e) => { })

        } else {

            interaction.member.roles.remove(rol).catch(e => { })

            const alındı = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`<@&${rol}> adlı rol başarıyla üzerinden alındı!`)

            return interaction.reply({ embeds: [alındı], ephemeral: true }).catch((e) => { })
        }
    }
})

// Destek Sistemi / Ticket
client.on('interactionCreate', async interaction => {

    let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
    if (!destek) return;
    let kanal = destek.kanal
    let channel = client.channels.cache.get(kanal)
    // Destek mesajı gönderme
    if (interaction.commandName === "destek-sistemi") {

        if (!destek) return;
        if (!channel) return louritydb.delete(`destekSistemi_${interaction.guild.id}`)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🎫")
                    .setLabel("Destek Talebi Oluştur")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("destekOlustur")
            )

        const destekKanalMesajı = new EmbedBuilder()
            .setColor("ff7063")
            .setAuthor({ name: `Destek | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() })
            .setDescription("`・` Destek açmak için aşağıdaki butona tıklayabilirsin\n`・` Lütfen gereksiz destek açmayın")
            .setFooter({ text: "Degace Destek Sistemi" })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())

        channel.send({ embeds: [destekKanalMesajı], components: [row] }).then(mesaj => {
            louritydb2.set(`destekMesajİd_${interaction.guild.id}`, mesaj.id)
        })

    }
    // Destek sistemi özelleştirme ve nedir butonları
    if (!interaction.isButton()) return;
    if (interaction.customId === "destekOzellestir" + interaction.user.id) {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Destek Mesajını Özelleştir")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("destekMesaji" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Buton Rengi")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("butonRenk" + interaction.user.id)
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji("1049574454520451105")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("messageDelete" + interaction.user.id)
            )

        const destekHata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Destek sistemi sunucuda aktif değil.")

        if (!destek) {
            interaction.message.delete().catch(e => { })
            return interaction.reply({ embeds: [destekHata], ephemeral: true })
        }
        const normal = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("Destek sistemini özelleştirme menüsüne hoşgeldin!\n\nAşağıdan istediğin bölümünü özelleştirebilirsin.")

        interaction.update({ embeds: [normal], components: [row] }).catch((e) => { })

    }
})

// Destek Sistemi | Form
client.on('interactionCreate', async interaction => {

    const destekModal = new ModalBuilder()
        .setCustomId('form1')
        .setTitle('Destek Mesajı Ayarlama Menüsü')
    const destek1 = new TextInputBuilder()
        .setCustomId('baslik')
        .setLabel('Embed Başlığını Yazınız')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(4)
        .setMaxLength(150)
        .setPlaceholder('Destek Sistemi')
        .setRequired(true)
    const destek2 = new TextInputBuilder()
        .setCustomId('aciklama')
        .setLabel('Embed Açıklaması Yazınız')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(4)
        .setMaxLength(350)
        .setPlaceholder('Talep açmak için aşağıdaki butona tıklayabilirsin! | Alt satıra geçmek için "enter"a basabilirsin.')
        .setRequired(true)

    const row = new ActionRowBuilder().addComponents(destek1);
    const row1 = new ActionRowBuilder().addComponents(destek2);
    destekModal.addComponents(row, row1);

    if (!interaction.isButton()) return;
    if (interaction.customId === "destekMesaji" + interaction.user.id) {

        const hataMesajı = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) return;
        let kanal = destek.kanal
        let channel = client.channels.cache.get(kanal)

        if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
        let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
        let message = await channel.messages.fetch(mesaj).catch((e) => { })

        if (!message) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

        if (message) {
            await interaction.showModal(destekModal);
        }
    }
})

// Destek Sistemi | Destek Mesajı Edit ve Form
client.on('interactionCreate', async interaction => {
    if (interaction.customId === 'form1') {

        const baslik = interaction.fields.getTextInputValue("baslik")
        const aciklama = interaction.fields.getTextInputValue("aciklama")

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) return;
        let kanal = destek.kanal
        let channel = client.channels.cache.get(kanal)

        const hataMesajı = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

        if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
        let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
        if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
        const edit = await channel.messages.fetch(mesaj)
        if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

        const basarili = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Destek mesajı başarıyla değiştirildi.")

        interaction.reply({ embeds: [basarili], ephemeral: true })

        const newEmbed = new EmbedBuilder()
            .setColor("ff7063")
            .setAuthor({ name: `Destek | ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL() })
            .setTitle(`${baslik}`)
            .setDescription(`${aciklama}`)
            .setFooter({ text: "Degace Destek Sistemi" })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())

        edit.edit({ embeds: [newEmbed] }).catch((e) => { })

    }
})


// Destek Sistemi | Destek oluştur
client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === "destekOlustur") {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Kapat")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("talebiKapat")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Arşivle")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("talebiArsivle")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("🔉")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("sesliDestek")
            )

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)

        if (!destek) {

            const sistemKapali = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Destek sistemi sunucuda aktif değil.")

            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
            interaction.reply({ embeds: [sistemKapali], ephemeral: true })
            return interaction.message.delete().catch(e => { })
        }

        let kategori = destek.kategori
        let kategorikontrol = interaction.guild.channels.cache.get(kategori)

        const kategoriyok = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Destek sistemi düzgün ayarlanmamış, kategoriyi bulamadım.")

        if (!kategorikontrol) return interaction.reply({ embeds: [kategoriyok], ephemeral: true })

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const botYetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

            return interaction.reply({ embeds: [botYetki], ephemeral: true })
        }

        let yetkiliRol = destek.yetkili

        const yetkiliHata = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Destek sistemi düzgün ayarlanmamış.")

        if (!yetkiliRol) return interaction.reply({ embeds: [yetkiliHata], ephemeral: true })

        let destekKontrol = louritydb2.get(`destek_${interaction.guild.id}`)

        if (destekKontrol) {
            let mbr = destekKontrol.sahip
            let knl = destekKontrol.kanal

            const zatenAcik = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Dostum zaten açık bir talebin mevcut <#${knl}>`)

            if (interaction.user.id === mbr) return interaction.reply({ embeds: [zatenAcik], ephemeral: true }).catch((e) => { })
        }

        interaction.guild.channels.create({
            name: `talep-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: kategori,

            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: yetkiliRol,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ]
        }).then((channelTwo) => {

            const basarili = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`Senin için bir destek talebi oluşturuldu <#${channelTwo.id}>`)

            interaction.reply({ embeds: [basarili], ephemeral: true });

            const destekEmbed = new EmbedBuilder()
                .setColor("ff7063")
                .setAuthor({ name: `Yeni bir destek isteği`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: "Destek Açan:", value: `${interaction.user}`, inline: true },
                    { name: "Destek Açılış Tarihi:", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                )
                .setFooter({ text: `Destek Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))

            louritydb2.set(`destek_${interaction.guild.id}`, { sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, kanal: channelTwo.id })
            channelTwo.send({ embeds: [destekEmbed], components: [row] }).then((msg) => {
                msg.pin().catch((e) => { })
            }).catch((e) => { })
            channelTwo.send({ content: `${interaction.user}, sesli destek için \`🔉\` butonuna tıklayabilirsin\nDestek **yetkililerine bildirim gönderilmiştir** lütfen etiket atmayın @everyone @here` }).catch((e) => { })
        }).catch((e) => {
            const hataembed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Maalesef destek **oluşturulamadı.**\n\n__Hata__: Kategoride 50'den fazla kanal olabilir.")

            return interaction.reply({ embeds: [hataembed], ephemeral: true })
        })

    }


    if (interaction.customId === "talebiArsivle") {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Arşivle")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("disabled")
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Sil")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("talebiSil")
            )

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const botYetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

            return interaction.reply({ embeds: [botYetki], ephemeral: true })
        }

        let id = interaction.channel.id
        if (id) {
            let ses = louritydb2.fetch(`destekSesli_${id}`)

            if (ses) {
                interaction.guild.channels.delete(ses).catch((e) => { })
            }
        }


        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) return;
        let yetkili = destek.yetkili

        const yetkihata = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Destek taleplerini sadece yetkililer arşivleyebilir.`)

        if (!interaction.member.roles.cache.has(yetkili)) return interaction.reply({ embeds: [yetkihata], ephemeral: true })

        let kontrol = louritydb2.get(`destek_${interaction.guild.id}`)

        const arsivhata = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Bu destek talebi maalesef arşivlenemiyor.`)

        if (!kontrol) return interaction.reply({ embeds: [arsivhata], ephemeral: true })

        let sahip = kontrol.sahip
        let zaman = kontrol.date
        let tag = kontrol.tag
        let date = `<t:${Math.floor(zaman / 1000)}:R>`
        let avatar = client.users.cache.get(sahip)


        interaction.channel.permissionOverwrites.edit(sahip, { ViewChannel: false });

        let dt = `<t:${Math.floor(Date.now() / 1000)}:R>`

        const destekMesajıTekrarı = new EmbedBuilder()
            .setColor("ff7063")
            .setAuthor({ name: `Bu destek talebi arşivlendi`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields(
                { name: "Destek Açan:", value: `<@${sahip}>`, inline: true },
                { name: "Destek Açılış Tarihi:", value: date, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "Talebi Arşivleyen Yetkili:", value: `<@${interaction.user.id}>`, inline: true },
                { name: "Arşivlenen Tarih:", value: dt, inline: true },
            )
            .setFooter({ text: `Destek Açan: ${tag}`, iconURL: avatar.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(avatar.displayAvatarURL({ dynamic: true }))

        interaction.update({ embeds: [destekMesajıTekrarı], components: [row] }).catch((e) => { })

        louritydb2.delete(`destek_${interaction.guild.id}`)
        louritydb2.delete(`destekSesli_${id}`)
    }

    if (interaction.customId === "talebiSil") {
        interaction.channel.delete().catch((e) => { })

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) return;
        const log = destek.log

        if (log) {
            let ch = client.channels.cache.get(log)
            if (ch) {

                let dt = `<t:${Math.floor(Date.now() / 1000)}:R>`

                const logEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `Bu destek talebi arşivlenerek kapatıldı`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .addFields(
                        { name: `Desteği Kapatan:`, value: `<@${interaction.user.id || "bulunamadı"}>`, inline: true },
                        { name: `Destek Kapanış Tarihi:`, value: `${dt || "bulunamadı"}`, inline: true },
                    )
                    .setThumbnail(interaction.user.avatarURL({ dynamic: true }))

                ch.send({ embeds: [logEmbed] }).catch((e) => { })
            }
        }

        let dt = `<t:${Math.floor(Date.now() / 1000)}:R>`
    }


    if (interaction.customId === "talebiKapat") {

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const botYetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

            return interaction.reply({ embeds: [botYetki], ephemeral: true })
        }

        let id = interaction.channel.id
        if (id) {
            let ses = louritydb2.fetch(`destekSesli_${id}`)

            if (ses) {
                interaction.guild.channels.delete(ses).catch((e) => { })
            }
        }


        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) return;
        const log = destek.log

        if (log) {
            let ch = client.channels.cache.get(log)
            if (ch) {

                let dstks = louritydb2.get(`destek_${interaction.guild.id}`)
                if (!dstks) {
                    interaction.channel.delete().catch((e) => { })

                    let dt = `<t:${Math.floor(Date.now() / 1000)}:R>`

                    const logEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `Bu destek talebinin verileri bulunamadı`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `Desteği Kapatan:`, value: `<@${interaction.user.id || "bulunamadı"}>`, inline: true },
                            { name: `Destek Kapanış Tarihi:`, value: `${dt || "bulunamadı"}`, inline: true },
                        )
                        .setThumbnail(interaction.user.avatarURL({ dynamic: true }))

                    return ch.send({ embeds: [logEmbed] }).catch((e) => { })
                }
                const tag = dstks.tag
                const zaman = dstks.date
                const sahip = dstks.sahip
                let avatar = client.users.cache.get(sahip)

                let dt = `<t:${Math.floor(zaman / 1000)}:R>`
                let dt2 = `<t:${Math.floor(Date.now() / 1000)}:R>`

                const logEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `${tag} adlı kişinin destek verileri` })
                    .addFields(
                        { name: `Destek Açan:`, value: `<@${sahip || "bulunamadı"}>`, inline: true },
                        { name: `Destek Açılış Tarihi:`, value: `${dt || "bulunamadı"}`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                        { name: `Desteği Kapatan:`, value: `<@${interaction.user.id || "bulunamadı"}>`, inline: true },
                        { name: `Destek Kapanış Tarihi:`, value: `${dt2 || "bulunamadı"}`, inline: true },
                    )
                    .setThumbnail(avatar.avatarURL({ dynamic: true }))

                ch.send({ embeds: [logEmbed] }).catch((e) => { })
            } else {
                return;
            }
        }

        louritydb2.delete(`destek_${interaction.guild.id}`)
        louritydb2.delete(`destekSesli_${id}`)
        interaction.channel.delete().catch((e) => { })
    }

    if (interaction.customId === "sesliDestek") {

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Kapat")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("talebiKapat")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Arşivle")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("talebiArsivle")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("🔇")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("sesliDestekKapat")
            )

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const botYetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

            return interaction.reply({ embeds: [botYetki], ephemeral: true })
        }

        let kontrol = louritydb2.get(`destek_${interaction.guild.id}`)
        if (!kontrol) return;
        let sahip = kontrol.sahip
        let zaman = kontrol.date
        let tag = kontrol.tag
        let date = `<t:${Math.floor(zaman / 1000)}:R>`
        let avatar = client.users.cache.get(sahip)

        const destekMesajıTekrarı = new EmbedBuilder()
            .setColor("ff7063")
            .setAuthor({ name: `Yeni bir destek isteği`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields(
                { name: "Destek Açan:", value: `<@${sahip}>`, inline: true },
                { name: "Destek Açılış Tarihi:", value: date, inline: true },
            )
            .setFooter({ text: `Destek Açan: ${tag}`, iconURL: avatar.displayAvatarURL({ dynamic: true }) || undefined })
            .setThumbnail(avatar.displayAvatarURL({ dynamic: true }))

        let name = interaction.channel.name
        let id = interaction.channel.id
        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        let kategori = destek.kategori
        let kategorikontrol = interaction.guild.channels.cache.get(kategori)

        const kategoriyok = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Destek sistemi düzgün ayarlanmamış, kategoriyi bulamadım.")

        if (!kategorikontrol) return interaction.reply({ embeds: [kategoriyok], ephemeral: true })

        const basarisiz = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Destek sistemi düzgün ayarlanmamış.")

        if (!destek) return interaction.reply({ embeds: [basarisiz], ephemeral: true })
        let yetkiliRol = destek.yetkili

        if (!yetkiliRol) return interaction.reply({ embeds: [basarisiz], ephemeral: true })

        interaction.guild.channels.create({
            name: name,
            type: Discord.ChannelType.GuildVoice,
            parent: kategori,

            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: yetkiliRol,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ]
        }).then((ses) => {
            interaction.update({ embeds: [destekMesajıTekrarı], components: [row1] }).catch((e) => { })
            louritydb2.set(`destekSesli_${id}`, ses.id)
        }).catch((e) => { })

    }

    if (interaction.customId === "sesliDestekKapat") {

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Kapat")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("talebiKapat")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Talebi Arşivle")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("talebiArsivle")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("🔉")
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("sesliDestek")
            )

        let me = interaction.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const botYetki = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Bunu yapabilmek için yeterli yetkiye sahip değilim.")

            return interaction.reply({ embeds: [botYetki], ephemeral: true })
        }

        let kontrol = louritydb2.get(`destek_${interaction.guild.id}`)

        const hataOlustu = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Sesli desteği kapatırken bir sorun oluştu.")

        if (!kontrol) return interaction.reply({ embeds: [hataOlustu], ephemeral: true })

        let id = interaction.channel.id
        let ses = louritydb2.fetch(`destekSesli_${id}`)
        let sesKontrol = interaction.guild.channels.cache.get(ses)

        const zatenSilinmis = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Sesli destek kanalı zaten silinmiş.")

        if (!ses) return interaction.reply({ embeds: [zatenSilinmis], ephemeral: true })
        if (!sesKontrol) {
            louritydb2.delete(`destekSesli_${id}`)
            return interaction.reply({ embeds: [zatenSilinmis], ephemeral: true })
        }

        let sahip = kontrol.sahip
        let zaman = kontrol.date
        let tag = kontrol.tag
        let date = `<t:${Math.floor(zaman / 1000)}:R>`
        let avatar = client.users.cache.get(sahip)

        const destekMesajıTekrarı = new EmbedBuilder()
            .setColor("ff7063")
            .setAuthor({ name: `Yeni bir destek isteği`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .addFields(
                { name: "Destek Açan:", value: `<@${sahip}>`, inline: true },
                { name: "Destek Açılış Tarihi:", value: date, inline: true },
            )
            .setFooter({ text: `Destek Açan: ${tag}`, iconURL: avatar.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(avatar.displayAvatarURL({ dynamic: true }))

        louritydb2.delete(`destekSesli_${id}`)
        interaction.guild.channels.delete(ses).catch((e) => { })
        return interaction.update({ embeds: [destekMesajıTekrarı], components: [row3] }).catch((e) => { })
    }

    if (interaction.customId === "destekAyarlar" + interaction.user.id) {

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) {

            const sistemKapali = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Destek sistemi sunucuda aktif değil.")

            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
            interaction.reply({ embeds: [sistemKapali], ephemeral: true })
            return interaction.message.delete().catch(e => { })
        }
        let kanal = destek.kanal
        let yetkili = destek.yetkili
        let kategori = destek.kategori
        let log = destek.log
        let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)

        const ayarlarMesaj = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("> Destek sistemi ayarları aşağıda mevcut")
            .addFields(
                { name: "Destek Kanalı:", value: `<#${kanal}>`, inline: true },
                { name: "Destek Yetkilisi:", value: `<@&${yetkili}>`, inline: true },
                { name: "Destek Kategorisi:", value: `<#${kategori}>`, inline: true },
                { name: "Destek Log:", value: `<#${log || "ayarlanmamış"}>`, inline: true },
                { name: "Destek Mesajı:", value: `[Mesaja Git](${`https://discord.com/channels/${interaction.guild.id}/${kanal}/${mesaj}`})`, inline: true },
            )

        return interaction.update({ embeds: [ayarlarMesaj] });
    }

    if (interaction.customId === "butonRenk" + interaction.user.id) {

        let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
        if (!destek) {

            const sistemKapali = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Destek sistemi sunucuda aktif değil.")

            louritydb2.delete(`destekMesajİd_${interaction.guild.id}`)
            interaction.reply({ embeds: [sistemKapali], ephemeral: true })
            return interaction.message.delete().catch(e => { })
        }

        let kanal = destek.kanal
        let channel = client.channels.cache.get(kanal)

        const hataMesajı = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

        if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
        let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
        if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
        const edit = channel.messages.fetch(mesaj).catch((e) => { })
        if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

        const buttonrenk = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("> Aşağıdaki menüyü kullanarak __**destek mesajının buton rengini değiştirebilirsin!**__")

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('renk')
                    .setPlaceholder('Buton rengini seç')
                    .addOptions([
                        {
                            label: "Kırmızı",
                            emoji: "🔴",
                            value: "destekRenkRed"
                        },
                        {
                            label: "Mavi",
                            emoji: "🔵",
                            value: "destekRenkMavi"
                        },
                        {
                            label: "Gri",
                            emoji: "1042738286394888284",
                            value: "destekRenkGri"
                        },
                        {
                            label: "Yeşil",
                            emoji: "🟢",
                            value: "destekRenkYesil"
                        }
                    ]))

        return interaction.reply({ embeds: [buttonrenk], components: [row], ephemeral: true }).catch((e) => { })
    }
});


client.on('interactionCreate', async interaction => {

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === "renk") {
        if (interaction.values[0] == "destekRenkRed") {

            let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
            if (!destek) return;
            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)

            const hataMesajı = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

            if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
            if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            const edit = channel.messages.fetch(mesaj).then(async message => {
                if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

                const kirmizi = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji("🎫")
                            .setLabel("Destek Talebi Oluştur")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("destekOlustur")
                    )

                await interaction.deferUpdate()
                return message.edit({ components: [kirmizi] }).catch((e) => { })
            }).catch((e) => { return interaction.reply({ embeds: [hataMesajı], ephemeral: true }) })
        }

        if (interaction.values[0] == "destekRenkMavi") {

            let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
            if (!destek) return;
            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)

            const hataMesajı = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

            if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
            if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            const edit = channel.messages.fetch(mesaj).then(async message => {
                if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

                const mavi = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji("🎫")
                            .setLabel("Destek Talebi Oluştur")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("destekOlustur")
                    )

                await interaction.deferUpdate()
                return message.edit({ components: [mavi] }).catch((e) => { })
            }).catch((e) => { return interaction.reply({ embeds: [hataMesajı], ephemeral: true }) })
        }

        if (interaction.values[0] == "destekRenkGri") {

            let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
            if (!destek) return;
            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)

            const hataMesajı = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

            if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
            if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            const edit = channel.messages.fetch(mesaj).then(async message => {
                if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

                const gri = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji("🎫")
                            .setLabel("Destek Talebi Oluştur")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("destekOlustur")
                    )

                await interaction.deferUpdate()
                return message.edit({ components: [gri] }).catch((e) => { })
            }).catch((e) => { return interaction.reply({ embeds: [hataMesajı], ephemeral: true }) })
        }

        if (interaction.values[0] == "destekRenkYesil") {

            let destek = louritydb.get(`destekSistemi_${interaction.guild.id}`)
            if (!destek) return;
            let kanal = destek.kanal
            let channel = client.channels.cache.get(kanal)

            const hataMesajı = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Mesajın bulunduğu kanal yok veya mesaj silinmiş.")

            if (!channel) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            let mesaj = louritydb2.fetch(`destekMesajİd_${interaction.guild.id}`)
            if (!mesaj) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })
            const edit = channel.messages.fetch(mesaj).then(async message => {
                if (!edit) return interaction.reply({ embeds: [hataMesajı], ephemeral: true })

                const yesil = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setEmoji("🎫")
                            .setLabel("Destek Talebi Oluştur")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("destekOlustur")
                    )

                await interaction.deferUpdate()
                return message.edit({ components: [yesil] }).catch((e) => { })
            }).catch((e) => { return interaction.reply({ embeds: [hataMesajı], ephemeral: true }) })
        }
    }
});


client.on("guildCreate", async guild => {

    let channel = "1049345035591745646"
    let ch = client.channels.cache.get(channel)

    if (!ch) return;

    let me = guild.members.cache.get(client.user.id)
    if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    var fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: Discord.AuditLogEvent.BotAdd,
    });

    var added = fetchedLogs.entries.first();

    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Degace Sunucuya Eklendi!")
        .setDescription(`Sunucu Adı: __${guild.name}__\nSunucu Üye Sayısı: __${guild.memberCount}__\nBotu Ekleyen: <@${added.executor.id || "bulunamadı"}> (__${added.executor.tag || "bulunamadı"}__)`)
        .setTimestamp()

    ch.send({ embeds: [embed] }).catch((e) => { })

})


// Bir Hata Oluştu
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
})

process.on("unhandledRejection", async (error) => {
    client.channels.cache.get(ERROR).send(`<:cevrimdisi:1049595271174164511> **Bir hata oluştu:** \`${error}\` <@936969979151130674>`)
    return console.log("Bir hata oluştu! " + error)
})




