const {
    ButtonInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
const DB = require("../../Structures/Schemas/ticket");
const { ParentNewTicketId, EveryoneId } = require("../../Structures/config.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction
     * 
     */
    async execute (interaction){
        if (!interaction.isButton) return;
        const { guild, member, customId } = interaction;
        if (!["support-ticket"].includes(customId)) return;

        const ID = Math.floor(Math.random() * 90000) + 10000;
        await guild.channels.create({
            name: `${customId + "-" + ID}`,
            type: 0,
            parent: ParentNewTicketId,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SendMessages", "ViewChannel", "ReadMessageHistory", "EmbedLinks", "AttachFiles"],
                },
                {
                    id: EveryoneId,
                    deny: ["SendMessages", "ViewChannel", "ReadMessageHistory", "EmbedLinks", "AttachFiles"],
                },
            ]
        })
        .then(async(channel) => {
            +await DB.create({
                guild_id: guild.id,
                member_id: member.id,
                ticket_id: ID,
                channel_id: channel.id,
                closed: false,
                locked: false,
                type: customId,
            });
            let author = {
                name: "Ticket system",
                icon: guild.iconURL({ dynamic: true })
            }
            let footer = {
                text: "The button below is for staff only."
            }
    
            const Embed = new EmbedBuilder()
            .setAuthor(author)
            .setDescription("This chat will only be viewed by the staff. Please describe your issue with as much detail as possibe")
            .setFooter(footer)
            .setColor(0x3498db);
    
            const Buttons = new ActionRowBuilder();
            Buttons.addComponents(
                new ButtonBuilder()
                .setCustomId("close-ticket")
                .setLabel("Close ticket")
                .setStyle("Primary"),
            );
            
            channel.send({
                embeds: [Embed],
                components: [Buttons],
            });
            await channel
            .send({ content: `${member}, here is your ticket`})
            .then((m) => {
                setTimeout(() => {
                  m.delete().catch(() => {});
              }, 1 * 25000);
            });
        });
    },
};