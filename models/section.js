const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
    civilizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Civilization"
        }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        }],
    author: { id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
        },
        username: String
        },
});

module.exports = mongoose.model("Section", sectionSchema);