// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds codeReferences page

// --------------
// --References--
// --------------
//
// !! Note !! This code is heavily based on https://github.com/knightsamar/cs340_sample_nodejs_app/
//
// See http://flip3.engr.oregonstate.edu:17771/codeReferences for a full list of references

// Creates instance of express.Router() for routing queries
module.exports = function() {
	var express = require('express');
	var router = express.Router();

	// Route to display students.handlebars 
	router.get('/',function(req,res) {
		var context = {};
		res.render('codeReferences',context);
		console.log("OK codeReferences!")
	});

	return router;
}();