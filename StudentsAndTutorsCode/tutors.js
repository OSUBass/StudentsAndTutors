// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds tutors page

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

	// SELECT for Subjects (used in New Tutors form)
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

	// SELECT for Tutors
	function selectTutors(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Tutors.tutorId, IFNULL((CONCAT(Tutors.firstName,' ',Tutors.lastName)),'--') AS tutorFullName, GROUP_CONCAT(CONCAT(Subjects.subjectName,' (', Subjects.subjectId,')') ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects FROM Tutors LEFT JOIN SubjectsTutors ON Tutors.tutorId = SubjectsTutors.tutorId LEFT JOIN Subjects ON Subjects.subjectId = SubjectsTutors.subjectId GROUP BY Tutors.tutorId ORDER BY Tutors.tutorId;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.tutors = results;
				console.log(results);
				loaded();
			});
	}

	// -----------
	// --Routing--
	// -----------

	// INSERT for Tutors
	// NOTE: req.body.subjectCheckbox will return a string for .length values 0-1, and an object for values 2+
	// IDs such as "10" will return a string length of "2"
	// Logic below accommodates for this 
	router.post('/', function(req,res){

		//Builds SQL query based on numbers of Subjects checked
		typeOfResponse = (typeof req.body.subjectCheckbox)
		numberOfSubjects = req.body.subjectCheckbox.length

		// console.log(req.body.subjectCheckbox.length,req.body.subjectCheckbox);

		if (typeOfResponse == "string") {
			var sql = "INSERT INTO Tutors (firstName, lastName) VALUES (?,?); SET @tutorIdInserted = (SELECT LAST_INSERT_ID()); INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (?,@tutorIdInserted);"
			var values = [req.body.tutorFirstName, req.body.tutorLastName, req.body.subjectCheckbox];
		}

		else if (typeOfResponse == "object") {

			inserts = ""

			for (var i=0; i<numberOfSubjects; i++) {
				inserts += "INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (" + req.body.subjectCheckbox[i] + ",@tutorIdInserted);"
			}

			var sql = "INSERT INTO Tutors (firstName, lastName) VALUES (?,?); SET @tutorIdInserted = (SELECT LAST_INSERT_ID());" + inserts;
			var values = [req.body.tutorFirstName, req.body.tutorLastName];
		}

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				console.log(JSON.stringify(err));
				res.end();
			} else {
				console.log(results);
				res.redirect('/tutors');
			}
		});
	});

	// INSERT/DELETE for SubjectsTutors (1:M relationship editing)
	// NOTE: req.body.subjectCheckbox will return a string for .length values 0-1, and an object for values 2+
	// IDs such as "10" will return a string length of "2"
	// Logic below accommodates for this 
	router.post('/update', function(req,res){

		//Builds SQL query based on numbers of Subjects checked
		typeOfResponse = (typeof req.body.subjectCheckbox);
		numberOfSubjects = req.body.subjectCheckbox.length;
		tutorId = req.body.updateTutorId;

		console.log("Type:",typeOfResponse," numberOfSubjects",numberOfSubjects," tutorId",tutorId);

		if (typeOfResponse == "string") {
			var sql = "DELETE FROM SubjectsTutors WHERE SubjectsTutors.TutorId = ?; INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (?,?);"
			var values = [tutorId, req.body.subjectCheckbox, tutorId];
		}

		else if (typeOfResponse == "object") {

			inserts = ""
		
			for (var i=0; i<numberOfSubjects; i++) {
				inserts += "INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (" + req.body.subjectCheckbox[i] + ","+tutorId+");"
			}

			var sql = "DELETE FROM SubjectsTutors WHERE SubjectsTutors.tutorId = ?;" + inserts;
			var values = tutorId;
		}

		console.log(sql);

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				console.log(JSON.stringify(err));
				res.end();
			} else {
				console.log(results);
				res.redirect('/tutors');
			}
		});
	});
	
	// Route to display tutors.handlebars
	router.get('/',function(req,res) {
		var context = {};
		var loadedCount = 0;

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		// Gets counts of SQL entities
		// Uses "loaded" to track if all queries are finished
		selectSubjects(res,mysql,context,loaded);
		selectTutors(res,mysql,context,loaded);

		// Renders route once all queries are finished
		function loaded(){
			loadedCount++;
			if(loadedCount >= 2) {
				res.render('tutors',context);
				console.log("OK tutors!, loadedCount =",loadedCount);
			}
		}
	});

	// DELETE for Tutors
	router.delete('/:tutorId',function(req,res){
		var sql = "DELETE FROM Tutors WHERE Tutors.tutorId = ?;";
		var values = [req.params.tutorId];

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