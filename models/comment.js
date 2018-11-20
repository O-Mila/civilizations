const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	content: String,
	author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Account"
			},
			username: String
			}
})

module.exports = mongoose.model("Comment", commentSchema);