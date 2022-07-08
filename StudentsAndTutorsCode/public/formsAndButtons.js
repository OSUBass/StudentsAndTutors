// ----------------
// --JS Functions--
// ----------------

// The routing helper functions below are almost identical to https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/public/deleteperson.js
// See http://flip3.engr.oregonstate.edu:17771/codeReferences for a full list of references

// -----------------
// --'/' Functions--
// -----------------

function resetDatabase(){
	$.ajax({
		url: '/',
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};

// -------------------------
// --'/students' Functions--
// -------------------------

function deleteStudent(studentId){
	$.ajax({
		url: '/students/' + studentId,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};

// -----------------------
// --'/Tutors' Functions--
// -----------------------

function deleteTutor(tutorId){
	$.ajax({
		url: '/tutors/' + tutorId,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};

// -------------------------
// --'/Subjects' Functions--
// -------------------------

// Redirects to /subjects instead of loading to clear POST data sent in searches
function deleteSubject(subjectId){
	$.ajax({
		url: '/subjects/' + subjectId,
		type: 'DELETE',
		success: function(result) {
			window.location = "/subjects";
		}
	})
};

// -----------------------------
// --'/Appointments' Functions--
// -----------------------------

function deleteAppointment(appointmentId){
	$.ajax({
		url: '/appointments/' + appointmentId,
		type: 'DELETE',
		success: function(result) {
			window.location.reload(true);
		}
	})
};

// -----------------------
// --'/UPDATE' Functions--
// -----------------------

// These functions are used in /students, /tutors, /appointments

// Makes row update options visible
function enableUpdate() {

	// Starts by resetting all disabled/display options in case user was editing a different row
	update = document.getElementsByClassName("select");

	for (i=0; i<update.length; i++) {
		update[i].disabled = true
	}

	// Resets confirm/undo options for all rows
	confirm = document.getElementsByClassName("confirm");
	undo = document.getElementsByClassName("undo");
	update = document.getElementsByClassName("update");
	del = document.getElementsByClassName("del");

	// Checkbox-specific options
	subjectsCondensed = document.getElementsByClassName("subjectsCondensed");
	subjectsAllCheckboxes = document.getElementsByClassName("subjectsAllCheckboxes");

	for (i=0; i<subjectsCondensed.length; i++) {
		subjectsCondensed[i].classList.remove("displayNone")
	}

	for (i=0; i<subjectsAllCheckboxes.length; i++) {
		subjectsAllCheckboxes[i].classList.add("displayNone")
	}

	for (i=0; i<confirm.length; i++) {
		confirm[i].classList.add("displayNone")
	}

	for (i=0; i<undo.length; i++) {
		undo[i].classList.add("displayNone")
	}

	for (i=0; i<update.length; i++) {
		update[i].classList.remove("displayNone")
	}

	for (i=0; i<del.length; i++) {
		del[i].classList.remove("displayNone")
	}

	// Find parent tr of edit button clicked, and enables form options
	clicked = event.target
	parentTr = clicked.closest("tr");

	// Adds back UPDATE options for selected row
	update = parentTr.getElementsByClassName("select");

	for (i=0; i<update.length; i++) {
		update[i].disabled = false
	}

	confirm = parentTr.getElementsByClassName("confirm");
	undo = parentTr.getElementsByClassName("undo");
	update = parentTr.getElementsByClassName("update");
	del = parentTr.getElementsByClassName("del");

	// Checkbox-specific options
	subjectsCondensed = parentTr.getElementsByClassName("subjectsCondensed");
	subjectsAllCheckboxes = parentTr.getElementsByClassName("subjectsAllCheckboxes");
	subjectCheckbox = parentTr.getElementsByClassName("subjectCheckbox");

	for (i=0; i<subjectsCondensed.length; i++) {
		subjectsCondensed[i].classList.add("displayNone")
	}

	for (i=0; i<subjectsAllCheckboxes.length; i++) {
		subjectsAllCheckboxes[i].classList.remove("displayNone")
	}

	// Logic to auto-check subject checkboxes for student
	for (i=0; i<subjectCheckbox.length; i++) {
		console.log("\("+subjectCheckbox[i].value.toString()+"\)")
		if (subjectsCondensed[0].textContent.includes("\("+subjectCheckbox[i].value.toString()+"\)")) {
		subjectCheckbox[i].checked = true;
		}
	}

	for (i=0; i<update.length; i++) {
		update[i].classList.add("displayNone")
	}

	for (i=0; i<del.length; i++) {
		del[i].classList.add("displayNone")
	}

	for (i=0; i<confirm.length; i++) {
		confirm[i].classList.remove("displayNone")
	}

	for (i=0; i<undo.length; i++) {
		undo[i].classList.remove("displayNone")
	}	
};

// Cancels out of row update
function undoUpdate() {

	// Starts by resetting all disabled/display options in case user was editing a different row
	update = document.getElementsByClassName("select");

	for (i=0; i<update.length; i++) {
		update[i].disabled = true
	}

	// Resets confirm/undo options for all rows
	confirm = document.getElementsByClassName("confirm");
	undo = document.getElementsByClassName("undo");
	update = document.getElementsByClassName("update");
	del = document.getElementsByClassName("del");

	for (i=0; i<confirm.length; i++) {
		confirm[i].classList.add("displayNone")
	}

	for (i=0; i<undo.length; i++) {
		undo[i].classList.add("displayNone")
	}

	for (i=0; i<update.length; i++) {
		update[i].classList.remove("displayNone")
	}

	for (i=0; i<del.length; i++) {
		del[i].classList.remove("displayNone")
	}

	// Reloads page and refreshes cache, to ensure table is up-to-date
	// This fixes a problem where user can change entry in dropdown, cancel edit, and then table will be wrong
	window.location.reload(true);
};

