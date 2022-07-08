// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds appointments page

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

	// SELECT for Students (used in "Schedule an Appointment!" form)
	function selectStudents(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Students.studentId, CONCAT(Students.firstName,' ',Students.lastName) AS studentName, GROUP_CONCAT(Subjects.subjectName ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects FROM Students LEFT JOIN SubjectsStudents ON Students.studentId = SubjectsStudents.studentId LEFT JOIN Subjects ON Subjects.subjectId = SubjectsStudents.subjectId GROUP BY Students.studentId ORDER BY Students.studentId;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.students = results;
				console.log(results);
				loaded();
			});
	}
	

	// SELECT for Tutors (used in "Schedule an Appointment!" form)
	function selectTutors(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Tutors.tutorId, CONCAT(Tutors.firstName,' ',Tutors.lastName) AS tutorName, GROUP_CONCAT(Subjects.subjectName ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects FROM Tutors LEFT JOIN SubjectsTutors ON Tutors.tutorId = SubjectsTutors.tutorId LEFT JOIN Subjects ON Subjects.subjectId = SubjectsTutors.subjectId GROUP BY Tutors.tutorId ORDER BY Tutors.tutorId;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.tutors = results;
				console.log(results);
				loaded();
			});
	}

	// SELECT for Subjects (used in "Schedule an Appointment!" form)
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

	// SELECT for Appointments
	// Updated to include Students.studentId, Tutors.tutorId, Subjects.subjectId fields for reference in UDPATE
	function selectAppointments(res,mysql,context,loaded) {
		mysql.pool.query(
			"SELECT Appointments.appointmentId, Students.studentId, Tutors.tutorId, Subjects.subjectId, IFNULL((CONCAT(Students.firstName,' ',Students.lastName)),'--') AS studentFullName, IFNULL((CONCAT(Tutors.firstName,' ',Tutors.lastName)),'--') AS tutorFullName, Subjects.subjectName, DATE_FORMAT(Appointments.dateTime,GET_FORMAT(DATETIME,'ISO')) as dateTime FROM Appointments LEFT JOIN Students ON Students.studentId = Appointments.studentId LEFT JOIN Tutors ON Tutors.tutorId = Appointments.tutorId JOIN Subjects ON Subjects.subjectId = Appointments.subjectId;",
			function(err,results) {
				if(err){
					res.end();
				}
				context.appointments = results;
				console.log(results);
				loaded();
			});
	}

	// -----------
	// --Routing--
	// -----------
	
	// Route to display students.handlebars
	router.get('/',function(req,res) {
		var context = {};
		var loadedCount = 0;

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		// Gets counts of SQL entities
		// Uses "loaded" to track if all queries are finished
		selectStudents(res,mysql,context,loaded);
		selectTutors(res,mysql,context,loaded);
		selectSubjects(res,mysql,context,loaded);
		selectAppointments(res,mysql,context,loaded);

		// Renders route once all queries are finished
		function loaded(){
			loadedCount++;
			if(loadedCount >= 4) {
				res.render('appointments',context);
				console.log("OK appointments!, loadedCount =",loadedCount);
			}
		}
	});

	// INSERT for Appointments
	router.post('/', function(req,res){

		var studentId = ""
		var tutorId = ""
		
		if (req.body.studentId == "NULL") {
			studentId = null
		} else {
			studentId = req.body.studentId
		}

		if (req.body.tutorId == "NULL") {
			tutorId = null
		} else {
			tutorId = req.body.tutorId
		}

		var date = req.body.date
		var time = req.body.time
		var dateTime = date + " " + time

		var sql = "INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (?,?,?,?);";
		var values = [studentId,tutorId,req.body.subjectId,dateTime];

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				console.log(JSON.stringify(err));
				res.end();
			} else {
				res.redirect('/appointments');
			}
		});
	});

	// UPDATE for Appointments
	router.post('/update', function(req,res){

		var studentId = ""
		var tutorId = ""
		
		if ((req.body.updateStudent == "NULL") || (req.body.updateStudent == "")) {
			studentId = null
		} else {
			studentId = req.body.updateStudent
		}

		if ((req.body.updateTutor == "NULL") || (req.body.updateTutor == "")) {
			tutorId = null
		} else {
			tutorId = req.body.updateTutor
		}

		var date = req.body.date
		var time = req.body.time
		var dateTime = date + " " + time

		var sql = "SET @appointmentIdSelection = ?; SET @studentIdSelection = ?; SET @tutorIdSelection = ?; UPDATE Appointments SET Appointments.studentId = @studentIdSelection WHERE Appointments.appointmentId = @appointmentIdSelection; UPDATE Appointments SET Appointments.tutorId = @tutorIdSelection WHERE Appointments.appointmentId = @appointmentIdSelection;";
		var values = [req.body.updateAppointment,studentId,tutorId];

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		sql = mysql.pool.query(sql,values,function(err,results,fields){
			if(err) {
				res.write(JSON.stringify(err));
				console.log(JSON.stringify(err));
				res.end();
			} else {

				console.log(results);
				res.redirect('/appointments');
			}
		});
	});

	// DELETE for Appointments
	router.delete('/:appointmentId',function(req,res){
		var sql = "DELETE FROM Appointments WHERE Appointments.appointmentId = ?;";
		var values = [req.params.appointmentId];

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