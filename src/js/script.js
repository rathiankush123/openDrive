// I have created this app for fun and learning.
// Please do not misuse below firebase config.
// Bon Appétit.

// ### Database Config

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBh31U1tVBHaNPn_2Bhk7tcDSba0BmHcrM",
  authDomain: "temp-drive-db.firebaseapp.com",
  databaseURL: "https://temp-drive-db.firebaseio.com",
  projectId: "temp-drive-db",
  storageBucket: "temp-drive-db.appspot.com",
  messagingSenderId: "900825678076"
};
firebase.initializeApp(config);

// Get the Database service for the default app
var db = firebase.database();

// Get a reference to the root of text_notes Database
var text_noteRef = firebase.database().ref('/text_notes/');

// Get a reference to the root of storageFileNames Database
var storageFileNamesRef = firebase.database().ref('/storageFileNames/');

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

function copyToClipboard(idOfInput) {
	var input = document.createElement('input');
    input.setAttribute('value', document.getElementById(idOfInput).value);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert("Copied!!");
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
	aXTag.innerHTML = "<img src='src/media/delete.png'>";

	var inputTag = document.createElement('input');
	inputTag.className = "form-control";
	inputTag.id = key;
	inputTag.value = note;
	inputTag.setAttribute("disabled", "disabled");

	var aCopyTag = document.createElement('a');
	aCopyTag.id = "basic-addon2";
	aCopyTag.className = "btn btn-info";
	aCopyTag.setAttribute('onclick',"copyToClipboard('"+key+"')");
	aCopyTag.innerHTML = "Copy";

	innerMostDiv.appendChild(aCopyTag);
	innerMostDiv.appendChild(aXTag);
	innerDiv.appendChild(inputTag);
	innerDiv.appendChild(innerMostDiv);
	outerMostDiv.appendChild(innerDiv);
	board.appendChild(outerMostDiv);
}

// ### Database Config

// Create a storage root reference
var storage = firebase.storage();
var storageRef = firebase.storage().ref();

//hide the spinner until clicked on "UPLOAD"
var spinnerAlpha = document.getElementById("spinnerAlpha");
var uploadBtn = document.getElementById("uploadBtn");

//list of file names from storage
var filesOnStorage = []

// hide spinner by default
spinnerAlpha.style.display = "none";

function uploadFile() {

	if(document.getElementById("uploadFile").files.length <= 0 ){
		alert("No file selected!");
		return false;
	}

	//show spinner and hide upload text
	spinnerAlpha.style.display = "inline-block";
	uploadBtn.style.display = "none";
	
	new Date();

	var fileToUpload = document.getElementById("uploadFile").files[0];
	var filenameArr = fileToUpload.name.split('.');
	var newFileName = filenameArr[0] + "_" + Date.now() + "." + filenameArr[1];
	var fileRef = storageRef.child(newFileName);
	//put request upload file to firebase storage
	fileRef.put(fileToUpload).then(function(snapshot) {
		spinnerAlpha.style.display = "none";
		uploadBtn.style.display = "inline-block";
		insertFileName(newFileName);
	});
}

function deleteFile(fileName, fileNamekey){

	if (confirm("Delete this file?")) {
		var desertRef = storageRef.child(fileName);
		desertRef.delete().then(function() {
			console.log(fileName + " is deleted.");
		}).catch(function(error) {
		  console.log("### ERROR - while deleting "+fileName+".");
		});		

		storageFileNamesRef.child(fileNamekey).remove();
		location.reload();
    }	
}

function downloadFile(fileName){

	storageRef.child(fileName).getDownloadURL().then(function(url) {
		console.log("-------------------------");
		console.log("### In case download doesn't work, click below URL to download "+fileName+".");
		console.log(url);
		console.log("-------------------------");

		var link=document.createElement('a');
		document.body.appendChild(link);
		link.href=url;
		link.click();
	}).catch(function(error) {
		console.log("### ERROR - while downloading "+fileName+".");
	});
}

function showFileNode(fileName, fileNamekey){

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
	aXTag.setAttribute('onclick',"deleteFile('"+fileName+"','"+fileNamekey+"')");
	aXTag.innerHTML = "<img src='src/media/delete.png'>";

	var inputTag = document.createElement('input');
	inputTag.className = "form-control";
	inputTag.value = fileName;
	inputTag.setAttribute("disabled", "disabled"); 

	var aCopyTag = document.createElement('a');
	aCopyTag.id = "basic-addon2";
	aCopyTag.className = "btn btn-info";
	aCopyTag.setAttribute('onclick',"downloadFile('"+fileName+"')");
	aCopyTag.innerHTML = "Download";

	innerMostDiv.appendChild(aCopyTag);
	innerMostDiv.appendChild(aXTag);
	innerDiv.appendChild(inputTag);
	innerDiv.appendChild(innerMostDiv);
	outerMostDiv.appendChild(innerDiv);
	board.appendChild(outerMostDiv);
}



function getFilesMetadata(){

	var fileName = "";
	var fileNamekey = "";

	storageFileNamesRef.once("value")
	  .then(function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var eachFileName = childSnapshot.val();
		      filesOnStorage.push(eachFileName.file+"|"+childSnapshot.key);
		  });
		for (var i = filesOnStorage.length - 1; i >= 0; i--) {
			// 		var tempName = filesOnStorage[i];

			fileName = filesOnStorage[i].split("|")[0];
			fileNamekey = filesOnStorage[i].split("|")[1];
			showFileNode(fileName, fileNamekey);
		}
	  });
}

function insertFileName(fileName){
	storageFileNamesRef.push().set({
	  file: fileName
	});
}

//handle showing textNotes
getAllTextNotes();

//handle showing fileNodes
getFilesMetadata();