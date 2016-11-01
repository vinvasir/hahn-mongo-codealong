var express = require("express");
var routes = express.Router();


routes.get("/", function(req, res) {
	res.send("Hello world!");
});

module.exports = routes;