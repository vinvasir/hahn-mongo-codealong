var express = require("express");

// require the passport module
var passport = require("passport");

// import the User model
var User = require("./models/user");

// start the router
var router = express.Router();

// define middleware to redirect visitors
// from pages that require login.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("info", "You must be logged in to see this page.");
		res.redirect("/login");
	}
}

// use middleware to set some variables for templates
router.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

// User list page. Query all the users
// and sort from newest to oldest.
router.get("/", function(req, res, next) {
	User.find()
	.sort({ createdAt: "descending" })
	.exec(function(err, users) {
		if (err) { return next(err); }
		res.render("index", { users: users });
	});
});

router.get("/signup", function(req, res) {
	res.render("signup");
});

router.post("/signup", function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username }, function(err, user) {
		if (err) { return next(err); }
		if (user) {
			req.flash("error", "User already exists.");
			return res.redirect("/signup");
		}

		var newUser = new User({
			username: username,
			password: password
		});
		newUser.save(next);

	});
}, passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/signup",
	failureFlash: true
}));

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}));

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

// a route that uses the "isAuthenticated" middleware
// defined above
router.get("/edit", ensureAuthenticated, function(req, res) {
	res.render("edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
	req.user.displayName = req.body.displayName;
	req.user.bio = req.body.bio;
	req.user.save(function(err) {
		if (err) {
			next(err);
			return;
		}
		req.flash("info", "Profile updated!");
		res.redirect("/edit");
	});
});

router.get("/users/:username", function(req, res, next) {
	User.findOne({ username: req.params.username }, function(err, user) {
		if(err) { return next(err); }
		if(!user) { return next(404); }
		res.render("profile", { user: user });
	});
});

module.exports = router;