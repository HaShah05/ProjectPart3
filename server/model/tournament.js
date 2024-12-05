// Importing mongoose
const mongoose = require("mongoose");

// Defining the workout schema and specifying the collection name
let tournamentModel = mongoose.Schema(
    {
        Date: Number,
        Name: String,
        Location: String,
        Description: String
    },
    { collection: "Bio_tournaments" }
);

// Exporting the workout model
module.exports = mongoose.model('Tournament', tournamentModel);
