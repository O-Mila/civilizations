const mongoose = require("mongoose");

const civSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
    sections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
            }],
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
            }],
    author: { 
            id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account" 
            }, 
            username: String 
            }
})

module.exports = mongoose.model("Civilization", civSchema);