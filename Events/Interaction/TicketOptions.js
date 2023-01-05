const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const { TranscriptsId } = require("../../Structures/config.json");
const DB = require("../../Structures/Schemas/ticket");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.isButton) return;
        const { guild, customId, channel, member } = interaction;

        try {
            if (!member.permissions.has(PermissionFlagsBits.Administrator)) return;
        } catch (err) {
            console.log("Failure at the PermissionFlagsBits part.")
            return;
        }
        if (!["close-ticket"].includes(customId)) return;

        const Embed = new EmbedBuilder().setColor(0x3498db);

        DB.findOne({ channel_id: channel.id }, async (err, docs) => {
            if (err) throw err;
            if (!docs)
             return interaction.reply({
                content:
                    "Data not found.",
                  ephimeral: true,
             });
             switch(customId) {
                case "close-ticket":
                    if(docs.closed == true)
                    return interaction.reply({
                        content: "Ticket is already closed!",
                        ephemeral: true,
                    });
                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        filename: `${docs.type} - ${docs.ticket_id}.html`,
                    });
                    await DB.findOneAndDelete({ channel_id: channel.id });
                    const MEMBER = guild.members.cache.get(docs.member_id);
                    let author = {
                        name: MEMBER.user.tag,
                        avatar: MEMBER.user.displayAvatarURL({ dynamic: true, format: "png" })
                    }
                    const Message = await guild.channels.cache.get(TranscriptsId).send({
                        Embeds: [
                            Embed.setAuthor(author).setTitle(`Transcript Type: ${docs.type}\nID: ${docs.TicketID}`),
                        ],
                        files: [attachment],
                    });

                    interaction.reply({
                        embeds: [
                            Embed.setDescription(
                                `Trahscript saved [TRANSCRIPT](${Message.url})`
                            ),
                        ],
                    });

                    setTimeout(() => {
                        channel.delete();
                    }, 10 * 1000);
             }
        });
    }
}