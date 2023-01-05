const { Modal, TextInputComponent, showModal} = require("discord-modals");

const {PermissionsBitField} = require("discord.js");

const { TravelerRole } = require("../../Structures/config.json");
const { GeneralChannel } = require("../../Structures/config.json");
const { GeneralLogsChannel } = require("../../Structures/config.json");
const { RolesChannel } = require("../../Structures/config.json");
const { VNSprout } = require("../../Structures/config.json");
const { VNStar } = require("../../Structures/config.json");

module.exports = {
    id: "member-accept",

    URL: "",
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction){
      if (!interaction.isButton()) return;
      const { guild, channel } = interaction;

      const User = guild.members.cache.get(channel.name)
      const Role = guild.roles.cache.get(TravelerRole);
      
      try {
        User.roles.add(Role);
      } catch (err) {
        await guild.channels.cache.get(GeneralLogsChannel).send(`The user with ID ` + channel.name + ` has left during verification.`);
        await channel.delete();
        return;
      }

        await guild.channels.cache.get(GeneralChannel).send(VNSprout + ` Welcome to ` + guild.name + `, ${User}\n\n` +

        VNStar + ` To start your travel, remember to pick up your` + ` <#${RolesChannel}> and take a look to our species on https://rinjacs.space/` + `\n\n` + 
        
        `Have a great exploration!`);
        await channel.delete();
    },
};