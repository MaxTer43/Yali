const {
    CommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
} = require("discord.js");
const DB = require("../../../Structures/Schemas/auction");

const { Yis } = require("../../../Structures/config.json");

module.exports = {
    name: "addauction",
    description: "Adds auction",
    permission: PermissionsBitField.Administrator,
    options: [
        {
            name: "sb",
            description: "Starting bid",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "ab",
            description: "Autobuy",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "mi",
            description: "Minimum increment",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "url",
            description: "Link to the image",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "description",
            description: "Description",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "starting_time",
            description: "Starting time (Number of hours to wait before starting this auction)",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "duration",
            description: "Duration (Number of hours)",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "currency",
            description: "Currency",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "usd",
                    value: "💵",
                },
                {
                    name: "yis",
                    value: Yis,
                },
            ],
        },
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction){
        try {
            const sb = interaction.options.getNumber('sb');
            const ab = interaction.options.getNumber('ab');
            var mi = interaction.options.getNumber('mi');
            const url = interaction.options.getString('url');
            const description = interaction.options.getString('description');
            var starting_time = interaction.options.getNumber('starting_time');
            const duration = interaction.options.getNumber('duration');
            const currency = interaction.options.getString('currency');
            if (sb >= ab)
                return interaction.reply({content: "ab cannot be equal or less than sb."});
            if (starting_time < 0)
                starting_time = 0;
            if (mi < 0)
                mi = 0;
            if (duration <= 0)
                return interaction.reply({content: "Duration cannot be 0 or less."});
            var startingDate = new Date();
            var expirationDate = new Date(startingDate);
            startingDate.setHours(startingDate.getHours() + starting_time);
            startingDate.setMilliseconds(0);
            expirationDate.setHours(expirationDate.getHours() + duration);

            const doc = await DB.find({}, {_id: true, auction_id: true});
            let auction_id = [];
            if (doc == null || doc.length == 0){

            }
            else{
                doc.forEach((t) => auction_id.push(t.auction_id.toNumber()));
            }
            let found = false;
            var generatedId = 0;
            if (auction_id.length > 0){
                do {
                    if (!auction_id.includes(generatedId))
                        found = true;
                    else
                        generatedId += 1;
                } while (found != true);
            }
            console.log("A auction has been added."
                +"\nID: " + generatedId
                +"\nSB: " + sb
                +"\nMI: " + mi
                +"\nAB: " + ab
                +"\nStarting date: " + startingDate
                +"\nExpiration date: " + expirationDate
                +"\nURL: " + url
                +"\nDescription: " + description
                +"\nCurrency: " + currency);
            await DB.create({
                auction_id: generatedId,
                sb: sb,
                mi: mi,
                ab: ab,
                starting_date: startingDate,
                expiration_date: expirationDate,
                image: url,
                description: description,
                currency: currency,
                cb: 0,
                highest_bidder: "None",
                message_id: " ",
                posted: 0
            });
            await interaction.reply({content: "Auction added"})
        } catch (error) {
            console.error(error);
            return interaction.reply({content: "You probably wrote something invalid or the database is offline."});
        }
    }
}