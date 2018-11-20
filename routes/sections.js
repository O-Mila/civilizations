// ========================== //
	  // SECTIONS ROUTES //
// ========================== //

var express = require("express");
var Civilization = require("../models/civilization");
var Section = require("../models/section");
var router = express.Router();
var middleware = require("../middleware");

// Displays a list of sections in the selected civilization
router.get("/civilizations/:id/sections", function(req, res) {
	Civilization.findById(req.params.id).populate("sections").exec(function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations/" + req.params.id);
		} else {
			res.render("sections/index", { civilization: civilization });
		}
	});
});

// Displays form for adding new sections of the selected civilization
router.get("/civilizations/:id/sections/new", middleware.isLoggedIn, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.render("sections/index");
		} else {
			res.render("sections/new", { civilization: civilization });
		}
	});
});

// Adds a new section to the DB and display updated list
router.post("/civilizations/:id/sections", middleware.isLoggedIn, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.render("sections/new");
		} else {
			var name = req.body.name;
			var image = req.body.image;
			var desc = req.body.description;
			var author = {
				id: req.user._id,
				username: req.user.username
				}
			var newSection = {name: name, image: image, description: desc, author: author};
			Section.create(newSection, function(err, newSection) {
				if(err) {
					console.log(err);
					res.render("sections/new");
				} else {
					civilization.sections.push(newSection);
					civilization.save();
					req.flash("success", "A new section was successfully added!")
					res.redirect("/civilizations/" + civilization._id + "/sections");
				}
			})
		}
	})
});

// Displays more info about the selected section
router.get("/civilizations/:id/sections/:section_id", function(req, res) {
	Civilization.findById(req.params.id).populate("sections").exec(function(err, foundCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Section.findById(req.params.section_id, function(err, foundSection) {
				if(err) {
					res.redirect("/civilizations/" + foundCiv._id + "/sections");
				} else {
					res.render("sections/show", { civilization: foundCiv, section: foundSection });
				}
			})
		}		
	});
});

// Displays form for updating the selected section
router.get("/civilizations/:id/sections/:section_id/edit", middleware.checkAuthorSection, function(req, res) {
	Civilization.findById(req.params.id, function(err, editCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Section.findById(req.params.section_id, function(err, editSection) {
				if(err) {
					console.log(err);
					res.redirect("/civilizations/" + editCiv._id + "/sections");
				} else {
					res.render("sections/edit", { civilization: editCiv, section: editSection });
				}
			})				
		}
	});
});

// Updates the section
router.put("/civilizations/:id/sections/:section_id", middleware.checkAuthorSection, function(req, res) {
	Civilization.findById(req.params.id, function(err, updatedCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Section.findByIdAndUpdate(req.params.section_id, req.body.section, function(err, updatedSection) {
				if(err) {
					res.redirect("/civilizations/" + updatedCiv._id + "/sections");
				} else {
					req.flash("success", "The section was successfully updated!");
					res.redirect("/civilizations/" + updatedCiv._id + "/sections/" + updatedSection._id);
				}
			})
		}
	});
});

// Deletes the civilization
router.delete("/civilizations/:id/sections/:section_id", middleware.checkAuthorSection, function(req, res) {
	Civilization.findById(req.params.id, function(err, civilization) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			Section.findByIdAndRemove(req.params.section_id, function(err) {
				req.flash("success", "The section was successfully deleted!");
				res.redirect("/civilizations/" + civilization._id + "/sections");
			})
		}
	});
});

module.exports = router;