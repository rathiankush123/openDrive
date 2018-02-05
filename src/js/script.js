// I have created this app for fun and learning.
// Please do not use below firebase config to currupt the app in any way. 
// Bon Appétit.

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBh31U1tVBHaNPn_2Bhk7tcDSba0BmHcrM",
  authDomain: "temp-drive-db.firebaseapp.com",
  databaseURL: "https://temp-drive-db.firebaseio.com",
  projectId: "temp-drive-db",
  storageBucket: "",
  messagingSenderId: "900825678076"
};
firebase.initializeApp(config);

// Get the Database service for the default app
var db = firebase.database();

// Get a reference to the root of the Database
var text_noteRef = firebase.database().ref('/text_notes/');

// fetch all existing text_notes
function getAllTextNotes(){
	var count = 0;
	text_noteRef.once("value")
	  .then(function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		    	count += 1;
		      var eachNote = childSnapshot.val();
		      showTextNote(childSnapshot.key, eachNote.note);
		  });
	  });
}
 
function deleteNote(key){
    if (confirm("Delete this note ?")) {
		text_noteRef.child(key).remove();
		location.reload();
    }
}

function insertTextNote(){
  var sticky_note = document.getElementById("sticky_note").value.trim();
  if (sticky_note.length > 0){
  	text_noteRef.push().set({
	  note: sticky_note
	});
  	location.reload();
  }else{
  	alert("Did you type in something ?");
  }
}

function copyToClipboard(element) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(element).select();
	document.execCommand("copy");
	$temp.remove();
	alert("Copied !!");
}

function showTextNote(key, note){

	var board = document.getElementById("board");

	var outerMostDiv = document.createElement('div');
	outerMostDiv.id = "textBlock";
	
	var innerDiv = document.createElement('div');
	innerDiv.className = "input-group mb-3";

	var innerMostDiv = document.createElement('div');
	innerMostDiv.className = "input-group-append";

	var aXTag = document.createElement('a');
	aXTag.id = "basic-addon2";
	aXTag.className = "btn btn-danger";
	aXTag.setAttribute('onclick',"deleteNote('"+key+"')");
	aXTag.innerHTML = "x";

	var inputTag = document.createElement('input');
	inputTag.className = "form-control";
	inputTag.value = note;
	inputTag.setAttribute("disabled", "disabled"); 

	var aCopyTag = document.createElement('a');
	aCopyTag.id = "basic-addon2";
	aCopyTag.className = "btn btn-info";
	aCopyTag.setAttribute('onclick',"copyToClipboard('"+inputTag.value+"')");
	aCopyTag.innerHTML = "Copy";

	innerMostDiv.appendChild(aCopyTag);
	innerMostDiv.appendChild(aXTag);
	innerDiv.appendChild(inputTag);
	innerDiv.appendChild(innerMostDiv);
	outerMostDiv.appendChild(innerDiv);
	board.appendChild(outerMostDiv);
}

getAllTextNotes();