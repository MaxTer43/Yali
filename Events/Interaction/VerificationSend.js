const { Modal } = require("discord-modals");
const {
    ButtonInteraction,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder
} = require("discord.js");

const { ParentNewUserId, EveryoneId, StaffChat } = require("../../Structures/config.json");

module.exports = {
    name: "modalSubmit",
    /**
     * 
     * @param {Modal} modal
     * @param {ButtonInteraction} interaction
     */
    async execute(modal, interaction){
        const { guild, member } = modal;
        if(modal.customId !== "verification-modal") return;
        await guild.channels.create({
            name: member.id,
            type: 0,
            parent: ParentNewUserId,
            permissionOverwrites: [{
                id: EveryoneId,
                deny: ["SendMessages", "ViewChannel", "ReadMessageHistory"],
            }]
        })
        .then(async(channel) => {
            await modal.deferReply({ ephemeral: true });
        
            const Q1 = modal.getTextInputValue("q1-modal");
            const Q2 = modal.getTextInputValue("q2-modal");
            const Q3 = modal.getTextInputValue("q3-modal");
            const Q4 = modal.getTextInputValue("q4-modal");
            const Q5 = modal.getTextInputValue("q5-modal");
        
            if (!isNaN(Q3)){
                if (Q3 < 13){
                    guild.channels.cache.get(StaffChat).send(modal.member.user.tag + " is too young (" + Q3 + " years old)");
                    modal.member.kick({reason: "Too young (" + Q3 + " years old)." });
                    channel.delete();
                    return;
                }
            }
            if (Q5 != 473068){
                try {
                    modal.member.send("Code incorrect! Please read the rules and write the correct code when submitting your verification.");
                } catch (error) {
                    guild.channels.cache.get(StaffChat).send(modal.member.user.tag + " has either blocked me or doesn't have DMs enabled");
                    modal.member.kick({reason: "Unable to send DMs." });
                }
                channel.delete();
                return;
            }

            let author = {
                name: modal.member.user.tag,
                avatar: modal.member.user.displayAvatarURL({ dynamic: true, format: "png" })
            }
            User = modal.member.user.id;
            const Embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setThumbnail(modal.member.user.displayAvatarURL({ dynamic : true, format: "png"}))
            .setAuthor(author)
            .setDescription(User)
            .addFields([
                { name: `1) Where did you find this server?`, value: Q1 },
                { name: `2) Why would you like to be in this server?`, value: Q2 },
                { name: `3) How old are you? Age range is valid too.`, value: Q3 },
                { name: `4) Are you into Closed Species?`, value: Q4 },
                { name: `5) Have you read the rules?`, value: Q5 },
            ]);

            const row = new ActionRowBuilder();
            row.addComponents(
                new ButtonBuilder()
                .setCustomId("member-accept")
                .setLabel("Accept")
                .setStyle("Success"),
                new ButtonBuilder()
                .setCustomId("member-message")
                .setLabel("Message")
                .setStyle("Secondary"),
                new ButtonBuilder()
                .setCustomId("member-reject")
                .setLabel("Kick")
                .setStyle("Danger"),
                new ButtonBuilder()
                .setCustomId("member-ban")
                .setLabel("Ban")
                .setStyle("Danger")
            )
            try {
                await modal.member.send({content: "Your application has been sent to the staff! Please wait for a response.\n\nHere's a copy of your application:", embeds: [Embed]});
                await channel.send({ embeds: [Embed], components: [row]});
            } catch (err) {
                guild.channels.cache.get(StaffChat).send(modal.member.user.tag + " has either blocked me or doesn't have DMs enabled");
                modal.member.kick({reason: "Unable to send DMs." });
                channel.delete();
            }
        });
    },
};