const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN, ERROR } = require("../config.json");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);

const louritydb2 = require("orio.db")

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(TOKEN || process.env.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
    client.channels.cache.get(ERROR).send(`[READY] <:cevrimdisi:1049595271174164511> **Bir hata oluştu:** \`${error}\` <@936969979151130674>`)
    return client.channels.cache.get(ERROR).send(`<:cevrimdisi:1049595271174164511> Degace aktif ama **bir şeyler ters gidiyor!**`)
  }

  console.log(`${client.user.tag} Aktif!`);
  louritydb2.set(`botAcilma_`, Date.now())
  client.channels.cache.get(ERROR).send(`<:cevrimici:1049595273061605407> Degace **sorunsuz bir şekilde aktif!**`)
  setInterval(async () => {

    const activities = ["🎉 • Yepyeni ve modern  | /yardım", "🤖 • Yapay zeka kayıt sistemini sende dene!"]
    const random = activities[
      Math.floor(Math.random() * activities.length)];
    client.user.setActivity(`${random}`)
  }, 16000);
};
