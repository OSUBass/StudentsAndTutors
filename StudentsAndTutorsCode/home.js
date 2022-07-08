// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds home content on index page

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

	// ---------------------
	// --SQL COUNT Queries--
	// ---------------------

	// Completes the "Our database contains" section of home.handlebars
	// If there is an error, ends the response process, otherwise, returns results

	function countStudents(res,mysql,context,loaded) {
		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM Students",
			function(err,results) {
				if(err){
					res.end();
				}
				context.countStudents = results[0].COUNT;
				loaded();
			});
	}

	function countTutors(res,mysql,context,loaded) {
		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM Tutors",
			function(err,results) {
				if(err){
					res.end();
				}
				context.countTutors = results[0].COUNT;
				loaded();
			});
	}

	function countSubjects(res,mysql,context,loaded) {
		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM Subjects",
			function(err,results) {
				if(err){
					res.end();
				}
				context.countSubjects = results[0].COUNT;
				loaded();
			});
	}

	function countAppointments(res,mysql,context,loaded) {
		mysql.pool.query("SELECT COUNT(*) AS COUNT FROM Appointments",
			function(err,results) {
				if(err){
					res.end();
				}
				context.countAppointments = results[0].COUNT;
				loaded();
			});
	}

	// -----------
	// --Routing--
	// -----------
	
	// Route to display home.handlebars
	router.get('/',function(req,res) {
		var context = {};
		var loadedCount = 0;

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');

		// Gets counts of SQL entities
		// Uses "loaded" to track if all queries are finished
		countStudents(res,mysql,context,loaded);
		countTutors(res,mysql,context,loaded);
		countSubjects(res,mysql,context,loaded);
		countAppointments(res,mysql,context,loaded);

		// Renders route once all queries are finished
		function loaded(){
			loadedCount++;
			if(loadedCount >= 4) {
				res.render('home',context);
				console.log("OK home!, loadedCount =",loadedCount);
			}
		}
	});

	// DROP/CREATE for "Reset database to sample data" button
	router.delete('/',function(req,res){

		var sql = "DROP TABLE IF EXISTS SubjectsStudents; DROP TABLE IF EXISTS SubjectsTutors; DROP TABLE IF EXISTS Appointments; DROP TABLE IF EXISTS Students; DROP TABLE IF EXISTS Subjects; DROP TABLE IF EXISTS Tutors; CREATE TABLE `Students` (`studentId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,`firstName` varchar(50) NOT NULL,`lastName` varchar(50) NOT NULL,PRIMARY KEY (`studentId`)) ENGINE=InnoDB; CREATE TABLE `Tutors` (`tutorId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,`firstName` varchar(50) NOT NULL,`lastName` varchar(50) NOT NULL,PRIMARY KEY (`tutorId`)) ENGINE=InnoDB; CREATE TABLE `Subjects` (`subjectId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,`subjectName` varchar(50) NOT NULL,PRIMARY KEY (`subjectId`)) ENGINE=InnoDB; CREATE TABLE `Appointments` (`appointmentId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,`studentId` int(10),`tutorId` int(10),`subjectId` int(10) NOT NULL,`dateTime` datetime NOT NULL,PRIMARY KEY (`appointmentId`),FOREIGN KEY (`studentId`) REFERENCES `Students` (`studentId`) ON DELETE CASCADE,FOREIGN KEY (`tutorId`) REFERENCES `Tutors` (`tutorId`) ON DELETE CASCADE,FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE) ENGINE=InnoDB;CREATE TABLE `SubjectsStudents` (`subjectId` int(10) NOT NULL,`studentId` int(10) NOT NULL,FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE,FOREIGN KEY (`studentId`) REFERENCES `Students` (`studentId`) ON DELETE CASCADE) ENGINE=InnoDB;CREATE TABLE `SubjectsTutors` (`subjectId` int(10) NOT NULL,`tutorId` int(10) NOT NULL,FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE,FOREIGN KEY (`tutorId`) REFERENCES `Tutors` (`tutorId`) ON DELETE CASCADE) ENGINE=InnoDB;INSERT INTO Subjects (subjectName) VALUES ('Art');INSERT INTO Subjects (subjectName) VALUES ('Business');INSERT INTO Subjects (subjectName) VALUES ('Chemistry');INSERT INTO Subjects (subjectName) VALUES ('Dance');INSERT INTO Subjects (subjectName) VALUES ('Economics');INSERT INTO Subjects (subjectName) VALUES ('French');INSERT INTO Subjects (subjectName) VALUES ('Geography');INSERT INTO Subjects (subjectName) VALUES ('History');INSERT INTO Subjects (subjectName) VALUES ('Internet Etiquette');INSERT INTO Subjects (subjectName) VALUES ('Jungian Psychology');INSERT INTO Students (firstName, lastName) VALUES ('Rachelle','Bass');SET @studentIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (2, @studentIdInserted);INSERT INTO Students (firstName, lastName) VALUES ('Donovan','Howe');SET @studentIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (4, @studentIdInserted);INSERT INTO Students (firstName, lastName) VALUES ('Rodney','Safetyfield');SET @studentIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (1, @studentIdInserted);INSERT INTO Students (firstName, lastName) VALUES ('Thomas','Cruiseford');SET @studentIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (4, @studentIdInserted);INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (6, @studentIdInserted);INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (9, @studentIdInserted);INSERT INTO Students (firstName, lastName) VALUES ('Sara','Braille');SET @studentIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (1, @studentIdInserted);INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (2, @studentIdInserted);INSERT INTO SubjectsStudents (subjectId, studentId) VALUES (3, @studentIdInserted);INSERT INTO Tutors (firstName, lastName) VALUES ('Alice','Academia');SET @tutorIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (1, @tutorIdInserted);INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (4, @tutorIdInserted);INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (9, @tutorIdInserted);INSERT INTO Tutors (firstName, lastName) VALUES ('Billy','Booksmart');SET @tutorIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (10, @tutorIdInserted);INSERT INTO Tutors (firstName, lastName) VALUES ('Catherine','Collegiate');SET @tutorIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (1, @tutorIdInserted);INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (7, @tutorIdInserted);INSERT INTO Tutors (firstName, lastName) VALUES ('Danny','Datapants');SET @tutorIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (2, @tutorIdInserted);INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (4, @tutorIdInserted);INSERT INTO Tutors (firstName, lastName) VALUES ('Eileen','Educated');SET @tutorIdInserted = (SELECT LAST_INSERT_ID());INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (6, @tutorIdInserted);INSERT INTO SubjectsTutors (subjectId, tutorId) VALUES (8, @tutorIdInserted);INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (2,1,4,'2021-03-01 12:00:00');INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (1,1,9,'2021-03-02 12:00:00');INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (3,NULL,1,'2021-03-03 12:00:00');INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (4,2,10,'2021-03-04 12:00:00');INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (NULL,1,4,'2021-03-05 12:00:00');";

		// Allows this .js file to access mysql as referenced in studentsAndTutors.js
		var mysql = req.app.get('mysql');
		var values = ""

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