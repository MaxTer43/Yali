const { Modal } = require("discord-modals");
const {
    ButtonInteraction,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { GeneralLogsChannel } = require("../../Structures/config.json");
const { ModLogsChannel } = require("../../Structures/config.json");

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
            if(modal.customId !== "msg-ban-modal") return;
            await modal.deferReply({ ephemeral: true });

            const Reason = modal.getTextInputValue("msg-ban-modal-text");
            const User = guild.members.cache.get(channel.name)
            await User.send("You have been banned for the following reason:\n" + Reason);

            let author = {
                name: User.user.tag,
                avatar: User.user.displayAvatarURL({ dynamic: true, format: "png" })
            }
    
            const Embed = new EmbedBuilder()
            .setColor("BLUE")
            .setThumbnail(User.user.displayAvatarURL({ dynamic : true, format: "png"}))
            .setAuthor(author)
            .setDescription(channel.name)
            .addFields([
                { name: `Member banned for the following reason:`, value: Reason},
            ]);
            

            //Send ban log to the mod-logs channel
            await guild.channels.cache.get(ModLogsChannel).send({ embeds: [Embed]});

            if (!User.permissions.has(PermissionFlagsBits.Administrator)){
                await User.ban({reason: Reason});
                await channel.delete();
            }
        } catch (err) {
            //Message log
            await guild.channels.cache.get(GeneralLogsChannel).send(`The user with ID ` + channel.name + ` has left during verification or has DMs disabled.`);
            await channel.delete();
        }
    },
};