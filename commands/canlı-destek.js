const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const louritydb = require("croxydb")
const Discord = require("discord.js")
const louritydb2 = require("orio.db")
module.exports = {
    name: "canlı-destek",
    description: "Yapamadığın bir şey mi oldu veya hata mı buldun hemen bize bildir",
    type: 1,
    options: [],

    run: async (client, interaction) => {

        louritydb2.set(`destekKullanici_${interaction.user.id}`, interaction.user.id)

    }
};