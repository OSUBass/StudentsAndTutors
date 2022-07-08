// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds subjects page

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

	// SELECT for Subjects
	function selectSubjects(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Subjects.subjectId, Subjects.subjectName FROM Subjects;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.subjects = results;
				console.log(results);
				loaded();
			});
	}

	// -----------
	// --Routing--
	// -----------
	
	// Route to display subjects.handlebars
	router.get('/',function(req,res) {
		var context = {};
		var loadedCount = 0;

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		// Gets counts of SQL entities
		// Uses "loaded" to track if all queries are finished
		selectSubjects(res,mysql,context,loaded);

		// Renders route once all queries are finished
		function loaded(){
			loadedCount++;
			if(loadedCount >= 1) {
				res.render('subjects',context);
				console.log("OK subjects!, loadedCount =",loadedCount);
			}
		}
	});

	// Search for Subjects
	// Loads both the search and database tables
	router.post('/search', function(req,res){
		var context = {};
		context.jsscripts = ["formsAndButtons.js"];

		var loadedCount = 0;

		var values = "%" + [req.body.subjectSearchName] + "%";
		var sql = "SELECT Subjects.subjectId, Subjects.subjectName FROM Subjects WHERE Subjects.subjectName LIKE ?";

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				res.end();
			} else {
				
				context.searchResults = results;
				loaded();
			}
		});

		selectSubjects(res,mysql,context,loaded);

		function loaded(){
			loadedCount++;
			if(loadedCount >= 2) {
				console.log("User searched for:",values,context.searchResults);
				res.render('subjects',context);
			}
		}
	});

	// INSERT for Subjects
	router.post('/', function(req,res){
		var sql = "INSERT INTO Subjects (subjectName) VALUES (?);"
		var values = [req.body.subjectName];

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				res.end();
			} else {
				console.log(results);
				res.redirect('/subjects');
			}
		});
	});

	// DELETE for Subjects
	router.delete('/:subjectId',function(req,res){
		var sql = "DELETE FROM Subjects WHERE Subjects.subjectId = ?;";
		var values = [req.params.subjectId];

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				res.status(400);
				res.end();
			} else {
				res.status(202).end();
			}
		});
	});

	// Returns router results once complete
	return router;
}();