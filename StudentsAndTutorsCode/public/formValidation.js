// See http://flip3.engr.oregonstate.edu:17771/codeReferences for a full list of references

// Adds listener to forms once DOM is loaded
document.addEventListener("DOMContentLoaded",subjectsListener);


// Form validation for "Subjects (select at least one)" forms on /students, /tutors
function subjectsListener() {

	// Locates checkboxes
	var checkboxes = document.getElementsByClassName("subjectCheckbox");
	var count = checkboxes.length;

	for (var i=0; i<checkboxes.length; i++) {

		// Adds listner to each checkbox
		checkboxes[i].addEventListener("click",function(event){

			var checkboxesInner = document.getElementsByClassName("subjectCheckbox");
			var countInner = 0;

			// Checks how many checkboxes are checked
			for (var i=0; i<checkboxesInner.length; i++) {
				if (checkboxesInner[i].checked == true) {
					countInner++;
				}
			}
	
			console.log("There are",countInner,"checkboxes checked!")
	
			// If no checkboxes are checked, adds "required" class
			if (countInner == 0) {
				for (var i=0; i<checkboxesInner.length; i++) {
					checkboxesInner[i].required = true;
					// console.log("Added required to",checkboxesInner[i]);
				}
			}
	
			// If at least one checkbox is checked, removes "required" class
			if (countInner > 0) {
				for (var i=0; i<checkboxesInner.length; i++) {
					checkboxesInner[i].required = false;
					// console.log("Removed required from",checkboxesInner[i]);
				}
			}
		});

		// Increments to next checkbox
		count++;
	}
}
