const { Modal } = require("discord-modals");
const {
    ButtonInteraction,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { GeneralLogsChannel } = require("../../Structures/config.json");

module.exports = {
    name: "modalSubmit",
    /**
     * 
     * @param {Modal} modal
     * @param {ButtonInteraction} interaction
     */
    async execute(modal, interaction){
        const { guild, channel } = modal;
        try {
            if(modal.customId !== "msg-message-modal") return;
            await modal.deferReply({ ephemeral: true });

            const Message = modal.getTextInputValue("msg-message-modal-text");
            const User = guild.members.cache.get(channel.name)
    
            const Embed = new EmbedBuilder()
            .setDescription(Message)

            await User.send({ content: `You have received a message from the administration:`, embeds: [Embed]});
            await User.send({ content: `Please, fill the application form again.`});

            //Message log
            await guild.channels.cache.get(GeneralLogsChannel).send("Message sent to " + User.user.tag);
            await guild.channels.cache.get(GeneralLogsChannel).send({ embeds: [Embed]});

            if (!User.permissions.has(PermissionFlagsBits.Administrator)){
                await channel.delete();
            }
        } catch (err) {
            //Message log
            await guild.channels.cache.get(GeneralLogsChannel).send(`The user with ID ` + channel.name + ` has left during verification or has DMs disabled.`);
            await channel.delete();
        }
    },
};