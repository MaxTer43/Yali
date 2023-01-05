const mongoose = require("mongoose");
const { Database } = require("../../Structures/config.json");
module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client){
        console.log("The client is now ready!")
        if (!Database) return;
        mongoose.connect(Database,{
            useNewURLParser: true,
        }).then(()=> {
            console.log("The client is now connected to the database!")
        }).catch((err) => {
            console.log(err)
        })
    }
}