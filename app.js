// require needed dependencies
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");

// set up passport
var setUpPassport = require("./setuppassport");

// put routes into a separate file
var routes = require("./routes");

// call express
var app = express();

// connect to the MongoDB server
mongoose.connect("mongodb://localhost:27017/test");

// call setUpPassport
setUpPassport();

app.set("port", process.env.PORT || 3000);

// set the static files directory
app.use(express.static(path.resolve(__dirname, 'public')));

// configure views directory and templating engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// mount middleware for form parsing,
// cookie parsing, sessions, and flash messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
	resave: true,
	saveUninitialized: true
}));
app.use(flash());

// initialize passport and use its sessions.
app.use(passport.initialize());
app.use(passport.session());

// mount the routes file at the root path
app.use(routes);

app.use(function(req, res) {
	res.send("Sorry, I don't recognize that path");
});

app.listen(app.get("port"), function() {
	console.log("Server started on port " + app.get("port"));
});