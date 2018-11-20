// ========================== //
	  // COMMENTS ROUTES //
// ========================== //

var express = require("express");
var Civilization = require("../models/civilization");
var Section = require("../models/section");
var Comment = require("../models/comment");
var router = express.Router();
var middleware = require("../middleware");

// Redirects /comments
router.get("/civilizations/:id/comments/", function(req, res) {
	res.redirect("/civilizations/" + req.params.id);
});

// Shows form for adding new comment to the civilization
router.get("/civilizations/:id/comments/new", middleware.isLoggedIn, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			res.render("comments_civilization/new", {civilization: civilization});
		}
	})
});

// Adds new comment to the civilization
router.post("/civilizations/:id/comments", middleware.isLoggedIn, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			var content = req.body.content;
			var author = { id: req.user._id, username: req.user.username };
			var newComment = { content: content, author: author };
			Comment.create(newComment, function(err, newComment) {
				if(err) {
					console.log(err);
					res.redirect("/civilizations/" + civilization._id);
				} else {
					civilization.comments.push(newComment);
					civilization.save(function(err) {
						if(err) {
							console.log(err);
						}
						res.redirect("/civilizations/" + civilization._id);
					});
				}
			})
		}
	})
	console.log("");
});

// Shows form to edit comment
router.get("/civilizations/:id/comments/:comment_id/edit", middleware.checkAuthorComment, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Comment.findById(req.params.comment_id, function(err, editComment) {
				if(err) {
					console.log(err);
					res.redirect("/civilizations");
				} else {
					res.render("comments_civilization/edit", { civilization: civilization, comment: editComment });
				}
			});
		}
	});
});

// Updates the comment
router.put("/civilizations/:id/comments/:comment_id", middleware.checkAuthorComment, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");	
		} else {
			var content = req.body.content;
			var author = { id: req.user._id, username: req.user.username };
			var newComment = { content: content, author: author };
			Comment.findByIdAndUpdate(req.params.comment_id, newComment, function(err, updatedComment) {
				if(err) {
					console.log(err);
				}
				res.redirect("/civilizations/" + civilization._id);
			});
		}
	})
});

// Deletes comment
router.delete("/civilizations/:id/comments/:comment_id", middleware.checkAuthorComment, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Comment.findByIdAndRemove(req.params.comment_id, function(err) {
				req.flash("success", "Your comment was successfully deleted!");
				res.redirect("/civilizations/" + civilization._id);
			})
		}
	});
});




// Redirects /comments
router.get("/civilizations/:id/sections/:section_id/comments/", function(req, res) {
	res.redirect("/civilizations/" + req.params.id + "/sections/" + req.params.section_id);
});

// Shows form for adding new comment
router.get("/civilizations/:id/sections/:section_id/comments/new", function(req, res) {
	res.render("comments_section/new");
});

// Adds new comment to the section
router.post("/civilizations/:id/sections/:section_id/comments", function(req, res) {
	// Add new comment to the show page
	// Redirect to the show page
})

module.exports = router;