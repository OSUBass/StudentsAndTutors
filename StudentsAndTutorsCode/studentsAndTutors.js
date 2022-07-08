// Rachelle Bass
// Donovan Howe
// CS 340, Introduction to Databases, web code
// Project Title: studentsandtutors.edu
// Project Group 29

// This .js file builds the main static HTML and templates

// ----------------
// --Server Setup--
// ----------------
//
// This will be hosted on at http://flip3.oregonstate.edu:17771/ unless otherwise noted
// PuTTy access via flip3.engr.oregonstate.edu 
// ./node_modules/forever/bin/forever start studentsAndTutors.js 17771 [will run studentsAndTutors.js on port 17771]
// ./node_modules/forever/bin/forever stop 0 [will stop forever script with id [0]]
//
// This project has the following dependencies: "express", "express-handlebars", "body-parser", "forever", "mysql"
// Steps to reproduce:
// 1. Create new directory at flip3.engr.oregonstate.edu
// 2. npm install
// 3. npm init [this creates package.json; for entry point:, type app.js]
// 4. npm install express --save
// 5. npm install express-handlebars --save
// 6. npm install body-parser --save
// 7. npm install forever --save
// 8. npm install mysql --save

// --------------------------------------
// --Functions from Node.js and modules--
// --------------------------------------
//
// Node.js
// 		require() [includes modules that exist in separate files]
//
// express
// 		app.use [specifies a middleware layer to add to express stack]
// 

// --------------
// --References--
// --------------
//
// !! Note !! This code is heavily based on https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/main.js
// Additional syntax and comments also based on work from OSU CS 290, Web Development
//
// See http://flip3.engr.oregonstate.edu:17771/codeReferences for a full list of references

// ------------------------
// --Node.js module setup--
// ------------------------

// Loads express module, makes express instance, sets port
var express = require('express');
var app = express();
app.set('port',17771);

// Loads mysql module, provides MySQL credentials, connection pool for up to 10 users
// Sets 'mysql' name to be used in queries
var mysql = require('./dbcon.js');
app.set('mysql',mysql)

// Loads express-handlebars module, sets default layout to ./views/layouts/index.handlebars
// Allows handlebars engine to handle .handlebar files, sets expected file type to .handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'index'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

// Loads body-parser module, parses urlencoded bodies, extended:true specifies that qs library will be used (extended syntax)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// Serves CSS, JS, and images from ./public, also allows root URL '/' to serve resources from ./public
app.use('/', express.static('public'));

// Serves handlebars files for /, /students, /tutors, /subjects and /appointments
app.use('/',require('./home.js'));
app.use('/students',require('./students.js'));
app.use('/tutors',require('./tutors.js'));
app.use('/subjects',require('./subjects.js'));
app.use('/appointments',require('./appointments.js'));
app.use('/codeReferences',require('./codeReferences.js'));

// ------------------
// --Error Handling--
// ------------------

// Provides routes for 404 and 500 statuses, as well as a console message when this file is running
app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// ----------------
// --Console Logs--
// ----------------

app.listen(app.get('port'),function(){
	console.log('Express started studentsAndTutors.js on port ' + app.get('port'))
	console.log('Great job!')
	console.log('Press Ctrl-C to terminate.')
});







