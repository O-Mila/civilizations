var Civilization = require("../models/civilization");
var Section = require("../models/section");
var Comment = require("../models/comment");

module.exports = {
	
	isLoggedIn: function(req, res, next) {
	if(req.isAuthenticated()) {
		next();
	} else {
		req.flash("error", "You have to be logged in to do that!");
		res.redirect("/login");
	}
	},

	checkAuthorCivilization: function(req, res, next) {
		if(req.isAuthenticated()) {
			Civilization.findById(req.params.id, function(err, createdCiv) {
				if(createdCiv.author.id.equals(req.user._id)) {
					next()
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			})
		}
	},

	checkAuthorSection: function(req, res, next) {
		if(req.isAuthenticated()) {
			Section.findById(req.params.section_id, function(err, section) {
				if(section.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/civilizations" + civilization._id + "/sections/" + section._id);
				}
			})				
		}
	},

	checkAuthorComment: function(req, res, next) {
		if(req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, function(err, comment) {
				if(comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/civilizations" + civilization._id);
				}
			})
		}
	}
}