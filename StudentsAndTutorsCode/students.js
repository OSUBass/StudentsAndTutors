// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds students page

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

	// SELECT for Subjects (used in New Students form)
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

	// SELECT for Students
	function selectStudents(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Students.studentId, IFNULL((CONCAT(Students.firstName,' ',Students.lastName)),'--') AS studentFullName, GROUP_CONCAT(CONCAT(Subjects.subjectName,' (', Subjects.subjectId,')') ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects FROM Students LEFT JOIN SubjectsStudents ON Students.studentId = SubjectsStudents.studentId LEFT JOIN Subjects ON Subjects.subjectId = SubjectsStudents.subjectId GROUP BY Students.studentId ORDER BY Students.studentId;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.students = results;
				console.log(results);
				loaded();
			});
	}


	// -----------
	// --Routing--
	// -----------

	// INSERT for Students
	// NOTE: req.body.subjectCheckbox will return a string for .length values 0-1, and an object for values 2+
	// IDs such as "10" will return a string length of "2"
	// Logic below accommodates for this 
	router.post('/', function(req,res){

		//Builds SQL query based on numbers of Subjects checked
		typeOfResponse = (typeof req.body.subjectCheckbox)
		numberOfSubjects = req.body.subjectCheckbox.length;

		// console.log(req.body.subjectCheckbox.length,req.body.subjectCheckbox);

		if (typeOfResponse == "string") {
			var sql = "INSERT INTO Students (firstName, lastName) VALUES (?,?); SET @studentIdInserted = (SELECT LAST_INSERT_ID()); INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (?,@studentIdInserted);"
			var values = [req.body.studentFirstName, req.body.studentLastName, req.body.subjectCheckbox];
		}

		else if (typeOfResponse == "object") {

			inserts = ""

			for (var i=0; i<numberOfSubjects; i++) {
				inserts += "INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (" + req.body.subjectCheckbox[i] + ",@studentIdInserted);"
			}

			var sql = "INSERT INTO Students (firstName, lastName) VALUES (?,?); SET @studentIdInserted = (SELECT LAST_INSERT_ID());" + inserts;
			var values = [req.body.studentFirstName, req.body.studentLastName];
		}

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				console.log(JSON.stringify(err));
				res.end();
			} else {
				console.log(results);
				res.redirect('/students');
			}
		});
	});


	// INSERT/DELETE for SubjectsStudents (1:M relationship editing)
	// NOTE: req.body.subjectCheckbox will return a string for .length values 0-1, and an object for values 2+
	// IDs such as "10" will return a string length of "2"
	// Logic below accommodates for this 
	router.post('/update', function(req,res){

		//Builds SQL query based on numbers of Subjects checked
		typeOfResponse = (typeof req.body.subjectCheckbox);
		numberOfSubjects = req.body.subjectCheckbox.length;
		studentId = req.body.updateStudentId

		console.log("Type:",typeOfResponse," numberOfSubjects",numberOfSubjects);

		if (typeOfResponse == "string") {
			var sql = "DELETE FROM SubjectsStudents WHERE SubjectsStudents.StudentId = ?; INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (?,?);"
			var values = [studentId, req.body.subjectCheckbox, studentId];
		}

		else if (typeOfResponse == "object") {

			inserts = ""
		
			for (var i=0; i<numberOfSubjects; i++) {
				inserts += "INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (" + req.body.subjectCheckbox[i] + ","+studentId+");"
			}

			var sql = "DELETE FROM SubjectsStudents WHERE SubjectsStudents.studentId = ?;" + inserts;
			var values = [req.body.updateStudentId];
		}

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				console.log(JSON.stringify(err));
				res.end();
			} else {
				console.log(results);
				res.redirect('/students');
			}
		});
	});
	
	// Route to display students.handlebars
	router.get('/',function(req,res) {
		var context = {};
		var loadedCount = 0;

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		// Gets counts of SQL entities
		// Uses "loaded" to track if all queries are finished
		selectSubjects(res,mysql,context,loaded);
		selectStudents(res,mysql,context,loaded);
		
		// Renders route once all queries are finished
		function loaded(){
			loadedCount++;
			if(loadedCount >= 2) {
				res.render('students',context);
				console.log("OK students!, loadedCount =",loadedCount);
			}
		}
	});

	// DELETE for Students
	router.delete('/:studentId',function(req,res){
		var sql = "DELETE FROM Students WHERE Students.studentId = ?;";
		var values = [req.params.studentId];

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