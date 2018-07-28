 $(document).ready(function() {
   

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBDocuXDALCmSp-6tZAlJgabVrbiWL-ifw",
    authDomain: "trainreservation-bbe9a.firebaseapp.com",
    databaseURL: "https://trainreservation-bbe9a.firebaseio.com",
    projectId: "trainreservation-bbe9a",
    storageBucket: "trainreservation-bbe9a.appspot.com",
    messagingSenderId: "234900099960"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  console.log(database);


  //on click events
  var name, destination, firstTrain, frequency = 0;

  $('#addTrain').on('click', function(){
    event.preventDefault();

    name        = $('#trainID').val().trim();
    firstTrain  = $('#first-train').val().trim();
    destination = $('#destination').val().trim();
    frequency   = $('#frequency').val().trim();
    console.log('appended'); 
    


    database.ref().push({
      name: name,
      destination: destination,
      firstTrain:  firstTrain,
      frequency:   frequency,
      dateAdded:   firebase.database.ServerValue.TIMESTAMP
    });
    $('form')[0].reset();
  });



  database.ref().on("child_added", function(childSnapshot){
    
   let current = moment();//calls libray
   $('.currTime').html("Current Time: " + current.format('h:mm A'))

    //Ensures Time clonflicts over calc. microsecends
    var newTrain = moment(childSnapshot.val().firstTrain, "hh:mm")
      .subtract(1, "years");
    
    var timeDifference = moment().diff(moment(newTrain), "minutes");

    var remainder = timeDifference % childSnapshot.val().frequency;

    var minutesAway = childSnapshot.val().frequency - remainder;

    var nextTrain   = moment().add(minutesAway, "minutes");
    var arrivalTime = moment(nextTrain).format("hh:mm A");
    
    $("#addRow").append("<tr><td>" + childSnapshot.val().name +
      "</td><td>" + childSnapshot.val().destination +
      "</td><td>" + childSnapshot.val().frequency   +
      "</td><td>" + arrivalTime + 
      "</td><td>" + minutesAway + "</td></tr>");

      console.log(nextTrain);
   
  });

  database.ref().orderByChild("dateAdded").limitToLast(1)
    .on("child_added", function(snapshot){

      $('#displayName').html(snapshot.val().name);
      $('#displayEmail').html(snapshot.val().email);
      $('#displayAge').html(snapshot.val().age);
      $('#comments').html(snapshot.val().comment);
    });
  
  //clear all text boxes
  $('#tainID').val("");
  $('#destination').val("");
  $('#first-train').val("");
  $('#frequency').val("");
 });
