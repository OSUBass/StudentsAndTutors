-- Rachelle Bass
-- Donovan Howe
-- CS 340, Project Step 7, Data Definition Queries
-- Project Title:studentsandtutors.edu
-- Project Group 29

-- This SQL file defines our entities and relationships, and inserts sample data

-- ------------
-- References--
-- ------------
-- 1. MariaDB AUTO_INCREMENT FAQ: https://mariadb.com/kb/en/auto_increment-faq/
-- 2. MariaDB SET Variable: https://mariadb.com/kb/en/set-variable/

-- ----------------
-- Table Creation--
-- ----------------

-- CREATE entities

CREATE TABLE `Students` (
	`studentId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,
	`firstName` varchar(50) NOT NULL,
	`lastName` varchar(50) NOT NULL,
	PRIMARY KEY (`studentId`)
	) ENGINE=InnoDB;

CREATE TABLE `Tutors` (
	`tutorId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,
	`firstName` varchar(50) NOT NULL,
	`lastName` varchar(50) NOT NULL,
	PRIMARY KEY (`tutorId`)
	) ENGINE=InnoDB;

CREATE TABLE `Subjects` (
	`subjectId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,
	`subjectName` varchar(50) NOT NULL,
	PRIMARY KEY (`subjectId`)
	) ENGINE=InnoDB;

CREATE TABLE `Appointments` (
	`appointmentId` int(10) NOT NULL AUTO_INCREMENT UNIQUE,
	`studentId` int(10),
	`tutorId` int(10),
	`subjectId` int(10) NOT NULL,
	`dateTime` datetime NOT NULL,
	PRIMARY KEY (`appointmentId`),
	FOREIGN KEY (`studentId`) REFERENCES `Students` (`studentId`) ON DELETE CASCADE,
	FOREIGN KEY (`tutorId`) REFERENCES `Tutors` (`tutorId`) ON DELETE CASCADE,
	FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE
	) ENGINE=InnoDB;

-- CREATE relationships

CREATE TABLE `SubjectsStudents` (
	`subjectId` int(10) NOT NULL,
	`studentId` int(10) NOT NULL,
	FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE,
	FOREIGN KEY (`studentId`) REFERENCES `Students` (`studentId`) ON DELETE CASCADE
	) ENGINE=InnoDB;

CREATE TABLE `SubjectsTutors` (
	`subjectId` int(10) NOT NULL,
	`tutorId` int(10) NOT NULL,
	FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`subjectId`) ON DELETE CASCADE,
	FOREIGN KEY (`tutorId`) REFERENCES `Tutors` (`tutorId`) ON DELETE CASCADE
	) ENGINE=InnoDB;

-- -------------
-- Sample Data--
-- -------------

-- INSERT sample data

-- Subjects sample data
-- Insert Subjects first so they are available for Students and Tutors
INSERT INTO Subjects (subjectName) VALUES ('Art');
INSERT INTO Subjects (subjectName) VALUES ('Business');
INSERT INTO Subjects (subjectName) VALUES ('Chemistry');
INSERT INTO Subjects (subjectName) VALUES ('Dance');
INSERT INTO Subjects (subjectName) VALUES ('Economics');
INSERT INTO Subjects (subjectName) VALUES ('French');
INSERT INTO Subjects (subjectName) VALUES ('Geography');
INSERT INTO Subjects (subjectName) VALUES ('History');
INSERT INTO Subjects (subjectName) VALUES ('Internet Etiquette');
INSERT INTO Subjects (subjectName) VALUES ('Jungian Psychology');

-- Students sample data; see References.1 for syntax
-- Inserts into SubjectsStudents for M:M Students->Subjects relationship
INSERT INTO Students (firstName, lastName) VALUES ('Rachelle','Bass');
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (2, @studentIdInserted);

INSERT INTO Students (firstName, lastName) VALUES ('Donovan','Howe');
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (4, @studentIdInserted);

INSERT INTO Students (firstName, lastName) VALUES ('Rodney','Safetyfield');
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (1, @studentIdInserted);

INSERT INTO Students (firstName, lastName) VALUES ('Thomas','Cruiseford');
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (4, @studentIdInserted);
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (6, @studentIdInserted);
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (9, @studentIdInserted);

INSERT INTO Students (firstName, lastName) VALUES ('Sara','Braille');
	SET @studentIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (1, @studentIdInserted);
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (2, @studentIdInserted);
	INSERT INTO SubjectsStudents (subjectId, studentId) 
		VALUES (3, @studentIdInserted);

-- Tutors sample data
-- Inserts into SubjectsTutors for M:M Tutors->Subjects relationship
INSERT INTO Tutors (firstName, lastName) VALUES ('Alice','Academia');
	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (1, @tutorIdInserted);
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (4, @tutorIdInserted);
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (9, @tutorIdInserted);

INSERT INTO Tutors (firstName, lastName) VALUES ('Billy','Booksmart');
	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (10, @tutorIdInserted);

INSERT INTO Tutors (firstName, lastName) VALUES ('Catherine','Collegiate');
	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (1, @tutorIdInserted);
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (7, @tutorIdInserted);

INSERT INTO Tutors (firstName, lastName) VALUES ('Danny','Datapants');
	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (2, @tutorIdInserted);
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (4, @tutorIdInserted);

INSERT INTO Tutors (firstName, lastName) VALUES ('Eileen','Educated');
	SET @tutorIdInserted = (SELECT LAST_INSERT_ID());
		
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (6, @tutorIdInserted);
	INSERT INTO SubjectsTutors (subjectId, tutorId) 
		VALUES (8, @tutorIdInserted);

-- Appointments sample data
-- Inserts into StudentsTutors for M:M Students->Tutors relationship
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (2,1,4,'2021-03-01 12:00:00');
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (1,1,9,'2021-03-02 12:00:00');
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (3,NULL,1,'2021-03-03 12:00:00');
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (4,2,10,'2021-03-04 12:00:00');
INSERT INTO Appointments (studentId, tutorId, subjectId, dateTime) VALUES (NULL,1,4,'2021-03-05 12:00:00');
