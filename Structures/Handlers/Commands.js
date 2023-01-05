const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Commands Loaded");

    CommandsArray = [];

    (await PG (`${process.cwd()}/Commands/*/*/*.js`)).map(async(file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "FAILED", "Name missing.")

        if (!command.context && !command.description)
        return Table.addRow(command.name, "FAILED", "Description missing.")

        if(command.permission){
            if(Perms.includes(command.permission))
                command.defaultPermission = false;
            else
                return Table.addRow(command.name, "FAILED", "Permission is invalid.")
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "SUCCESSFUL");
    });

    console.log(Table.toString());

    //PERMISSIONS CHECK
    client.on("ready", () => client.guilds.cache.forEach(g => g.commands.set(CommandsArray).catch(() => {})));
}