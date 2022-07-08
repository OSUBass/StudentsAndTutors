-- Rachelle Bass
-- Donovan Howe
-- CS 340, Project Step 7, Data Manipulation Queries
-- Project Title:studentsandtutors.edu
-- Project Group 29

-- This SQL file defines our data manipulation queries
-- Variables from the backend programming are denoted with a colon ":"

-- ------------
-- References--
-- ------------
-- 1. AUTO_INCREMENT FAQ: https://mariadb.com/kb/en/auto_increment-faq/
-- 2. GROUP_CONCAT: https://mariadb.com/kb/en/group_concat/

-- -------------------------
-- Queries for /index.html--
-- -------------------------

-- SELECTS for length of Students, Tutors, Subjects, Appointments entities
-- These are used to complete "Our database contains: __ Students | __ Tutors | __ Subjects | __ Appointments"
SELECT COUNT(*) FROM Students;
SELECT COUNT(*) FROM Tutors;
SELECT COUNT(*) FROM Subjects;
SELECT COUNT(*) FROM Appointments;

-- DROP TABLEs
-- Used in the "Reset database to sample data" button in combination with Data Definition Queries
DROP TABLE IF EXISTS SubjectsStudents; 
DROP TABLE IF EXISTS SubjectsTutors; 
DROP TABLE IF EXISTS Appointments; 
DROP TABLE IF EXISTS Students; 
DROP TABLE IF EXISTS Subjects; 
DROP TABLE IF EXISTS Tutors;

-- ----------------------------
-- Queries for /students.html--
-- ----------------------------

-- SELECT to build HTML table
-- See GROUP_CONCAT syntax in References.2
SELECT Students.studentId, IFNULL((CONCAT(Students.firstName,' ',Students.lastName)),'--') AS studentFullName, GROUP_CONCAT(Subjects.subjectName ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects
	FROM Students
		LEFT JOIN SubjectsStudents ON Students.studentId = SubjectsStudents.studentId
			LEFT JOIN Subjects ON Subjects.subjectId = SubjectsStudents.subjectId
				GROUP BY Students.studentId
					ORDER BY Students.studentId;

-- INSERT for form submission, multiple "INSERT INTO SubjectsStudents" may be requried
INSERT INTO Students (firstName, lastName) 
	VALUES (:firstNameInput,:lastNameInput);
	
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());

	-- Note: Retrieves new studentId via LAST_INSERT_ID() as prescribed at https://mariadb.com/kb/en/auto_increment-faq/
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (:subjectIdInput, @studentIdInserted);

-- DELETE for relationship to SubjectsStudents (1:M)
DELETE FROM SubjectsStudents WHERE SubjectsStudents.StudentId = :studentIdSelection;

-- Row updates for SubjectsStudents relationship use DELETE above + INSERT
SET @studentIdInserted = :studentIdSelection;
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (:subjectIdInput, @studentIdInserted);

-- DELETE for row deletion
DELETE FROM Students WHERE Students.studentId = :studentIdSelection;

-- --------------------------
-- Queries for /tutors.html--
-- --------------------------

-- SELECT to build HTML table
SELECT Tutors.tutorId, IFNULL((CONCAT(Tutors.firstName,' ',Tutors.lastName)),'--') AS tutorFullName, GROUP_CONCAT(Subjects.subjectName ORDER BY Subjects.subjectName SEPARATOR ', ') AS subjects
	FROM Tutors
		LEFT JOIN SubjectsTutors ON Tutors.tutorId = SubjectsTutors.tutorId
			LEFT JOIN Subjects ON Subjects.subjectId = SubjectsTutors.subjectId
				GROUP BY Tutors.tutorId
					ORDER BY Tutors.tutorId;

-- INSERT for form submission, multiple "INSERT INTO SubjectsTutors" may be requried
INSERT INTO Tutors (firstName, lastName) 
	VALUES (:firstNameInput,:lastNameInput);

	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());

	-- Note: Retrieves new tutorId via LAST_INSERT_ID() as prescribed at https://mariadb.com/kb/en/auto_increment-faq/
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (:subjectIdInput, @tutorIdInserted);

-- DELETE for relationship to SubjectsStudents (1:M)
DELETE FROM SubjectsTutors WHERE SubjectsTutors.TutorId = :tutorIdSelection;

-- Row updates for SubjectsStudents relationship use DELETE above + INSERT
SET @TutorIdInserted = :tutorIdSelection;
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (:subjectIdInput, @tutorIdInserted);

-- DELETE for row deletion
DELETE FROM Tutors WHERE Tutors.tutorId = :tutorIdSelection;

-- ----------------------------
-- Queries for /subjects.html--
-- ----------------------------

-- SELECT to build HTML table
SELECT Subjects.subjectId, Subjects.subjectName
	FROM Subjects;

-- SELECT to search subjects
SELECT Subjects.subjectId, Subjects.subjectName
	FROM Subjects
		WHERE Subjects.subjectName LIKE '%:subjectSearchInput%';

-- INSERT for form submission
INSERT INTO Subjects (subjectName) VALUES (:subjectNameInput);

-- DELETE for row deletion
DELETE FROM Subjects WHERE Subjects.subjectId = :subjectIdSelection;

-- --------------------------------
-- Queries for /appointments.html--
-- --------------------------------

-- SELECT to build HTML table
SELECT Appointments.appointmentId, Students.studentId, Tutors.tutorId, Subjects.subjectId,
	IFNULL((CONCAT(Students.firstName,' ',Students.lastName)),'--') AS studentFullName,
	IFNULL((CONCAT(Tutors.firstName,' ',Tutors.lastName)),'--') AS tutorFullName,
	Subjects.subjectName, 
	DATE_FORMAT(Appointments.dateTime,GET_FORMAT(DATETIME,'ISO')) as dateTime
		FROM Appointments
			LEFT JOIN Students ON Students.studentId = Appointments.studentId
				LEFT JOIN Tutors ON Tutors.tutorId = Appointments.tutorId
					JOIN Subjects ON Subjects.subjectId = Appointments.subjectId;

-- INSERT for form submission
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) 
	VALUES (:studentIdSelection, :tutorIdSelection, :subjectIdSelection, :dateTimeSelection);


-- UDPATE for row updates
SET @appointmentIdSelection = :appointmentIdSelection;
SET @studentIdSelection = :studentIdSelection;
SET @tutorIdSelection = :tutorIdSelection; 
	UPDATE Appointments SET Appointments.studentId = @studentIdSelection WHERE Appointments.appointmentId = @appointmentIdSelection;
	UPDATE Appointments SET Appointments.tutorId = @tutorIdSelection WHERE Appointments.appointmentId = @appointmentIdSelection;

-- DELETE for row deletion
DELETE FROM Appointments WHERE Appointments.appointmentId = :appointmentIdSelection;

-- SELECT for StudentsTutors html table (Added Feb 20, 2021), this may not be used
SELECT GROUP_CONCAT(Students.firstName,' ',Students.lastName) AS student, GROUP_CONCAT(Tutors.firstName,' ',Tutors.lastName) AS tutors
	FROM Students
		LEFT JOIN StudentsTutors ON Students.studentId = StudentsTutors.studentId
			LEFT JOIN Tutors ON Tutors.tutorId = StudentsTutors.tutorId
				GROUP BY Students.studentId
					ORDER BY Students.studentId;