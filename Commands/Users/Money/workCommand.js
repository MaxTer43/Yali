const {
    EmbedBuilder,
    CommandInteraction,
    PermissionsBitField
} = require("discord.js");
const bankDb = require("../../../Structures/Schemas/bank");
const jobDb = require("../../../Structures/Schemas/job");
const workScheduleDb = require("../../../Structures/Schemas/work_schedule");
const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "work",
    description: "Work for some extra yis",
    permission: PermissionsBitField.Administrator,
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const { client } = interaction;
            const User = client.users.cache.get(interaction.member.user.id);
            const id = interaction.member.user.id;

            idExists = await bankDb.exists({user_id: id});
            if (!idExists){
                await bankDb.create({
                    user_id: id,
                    cash: 0,
                    bank: 0,
                    bid_amount: 0
                });
                console.log("Created bank account with id " + id);
            }
            workIdExists = await workScheduleDb.exists({user_id: id});
            var workSchedule = new Date();
            workSchedule.setHours(workSchedule.getHours() + 6);
            var now = new Date();
            let list = [];
            let date = new Date();
            date = [];

            let author = {
                name: User.tag
            }

            if (!workIdExists){
                await workScheduleDb.create({
                    user_id: id,
                    date: workSchedule,
                    reminder: 0,
                });
                console.log("Created work schedule for id " + id);
            }
            else{
                const workDoc = await workScheduleDb.find({user_id: id}, {});
                workDoc.forEach((t) =>
                    date.push(t.date),
                );
                if (now < date[0]){
                    const Embed = new EmbedBuilder()
                    .setColor("BLACK")
                    .setThumbnail(User.displayAvatarURL({ dynamic : true, format: "png"}))
                    .setAuthor(author)
                    .setDescription(`You can work again in <t:${Math.floor(date[0].getTime()/1000)}:R>.`);
                    return interaction.reply({ embeds: [Embed], ephemeral: true});
                }
            }
            const jobDoc = await jobDb.find({}, {_id: false, job: true, date: true});
            if (jobDoc == null){
                return interaction.reply("The list is empty.");
            }
            jobDoc.forEach((t) =>
                list.push(t.job),
            );
            const random = Math.floor(Math.random() * list.length);
            const award = Math.floor(Math.random() * 37) + 1;
            let job = list[random].replace("[]", Yis + award.toString());
            await jobDb.findOneAndUpdate(
                {user_id: id},
                {$inc:{cash: award}, $set:{date: workSchedule}}
            )
            const Embed = new EmbedBuilder()
                .setColor("BLACK")
                .setThumbnail(User.displayAvatarURL({ dynamic : true, format: "png"}))
                .setAuthor(author)
                .setDescription(job);

            await interaction.reply({ embeds: [Embed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}