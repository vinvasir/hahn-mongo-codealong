var passport = require("passport");

var Usesr = require("./models/user");

var LocalStrategy = require("passport-local").Strategy;

passport.use("login", new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) {
			return done(null, false, { message: "No user has that username!" });
		}
		user.checkPassword(password, function(err, isMatch) {
			if (err) { return done(err); }
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Invalid password."});
			}
		});
	})
}));

module.exports = function() {
	// return a user object with an ID.
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	// turn an ID into a user object.
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};