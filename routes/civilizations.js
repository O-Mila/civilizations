//=====================//
// CIVILIZATION ROUTES //
//=====================//

var express = require("express");
var Civilization = require("../models/civilization");
var router = express.Router();
var middleware = require("../middleware");

// Displays list of civilizations in the database
router.get("/civilizations", function(req, res) {
	Civilization.find({}, function(err, allCivs) {
		if(err) {
			console.log("Oops, something went wrong:");
			console.log(err);
		} else {
			res.render("civilizations/index", { civilizations: allCivs });
		}
	})
})

// Displays form for adding new civilizations
router.get("/civilizations/new", middleware.isLoggedIn, function(req, res) {
	res.render("civilizations/new");
})

// Adds a new civilization to the DB and displays updates list
router.post("/civilizations", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCiv = {name: name, image: image, description: description, author: author};
		Civilization.create(newCiv, function(err, civilization) {
		if(err) {
			console.log(err);
			res.render("civilizations/new");
		} else {
			req.flash("success", "A new civilization was successfully added!");
			res.redirect("/civilizations");	
		}
	});
});

// Displays more info about the selected civilization
router.get("/civilizations/:id", function(req, res) {
	Civilization.findById(req.params.id).populate("sections").populate("comments").exec(function(err, foundCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");

		} else {
			res.render("civilizations/show", { civilization: foundCiv });
		}
	});
});

// Displays form for updating the selected civilization
router.get("/civilizations/:id/edit", middleware.checkAuthorCivilization, function(req, res) {
	Civilization.findById(req.params.id, function(err, editCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			res.render("civilizations/edit", { civilization: editCiv });			
		}
	});
});

// Updates the civilization
router.put("/civilizations/:id", middleware.checkAuthorCivilization, function(req, res) {
	Civilization.findByIdAndUpdate(req.params.id, req.body.civ, function(err, updatedCiv) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			req.flash("success", "The civilization was successfully updated!");
			res.redirect("/civilizations/" + req.params.id);
		}
	});
});

// Deletes the civilization
router.delete("/civilizations/:id", middleware.isLoggedIn, function(req, res) {
	Civilization.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			console.log(err);
			res.redirect("/civilizations");
		} else {
			req.flash("success", "The civilization was successfully deleted!");
			res.redirect("/civilizations");
		}
	});
});


module.exports = router;