// =========================== //
// ==  INDEX & AUTH ROUTES  == //
// =========================== //

var express = require("express");
var router = express.Router();
var Account = require("../models/account");
var passport = require("passport");


// Home page redirects to index
router.get("/", function(req, res) {
	res.redirect("/civilizations");
})

// Show register form
router.get("/register", function(req, res) {
	res.render("register");
});

// Add a new account to the database and login
router.post("/register", function(req, res) {
	var newAccount = new Account({username: req.body.username});
	Account.register(newAccount, req.body.password, function(err, account) {
		if(err){
			req.flash("error", err.message);
			res.render("register");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to our community, " + newAccount.username);
				res.redirect("/civilizations");				
			})
		}
	})
});

// Show login form
router.get("/login", function(req, res) {
	res.render("login");
});

// Login registered account
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/civilizations",
		failureRedirect: "/login"
	}), function(req, res) {
});

// Logout account
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged out successfully");
	res.redirect("back");
})


module.exports = router;