 $(document).ready(function () {


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

   $('#addTrain').on('click', function () {
     event.preventDefault();

     name = $('#trainID').val().trim();
     firstTrain = $('#first-train').val().trim();
     destination = $('#destination').val().trim();
     frequency = $('#frequency').val().trim();
     console.log('appended');

     if (name === '' || destination === '' || frequency === '') {
       alert('Invalid Input types, Try Again')
     } else {

      var trainInfo = {   
         name: name,
         destination: destination,
         firstTrain: firstTrain,
         frequency: frequency,
         dateAdded: firebase.database.ServerValue.TIMESTAMP
      }
      database.ref('train_info').push(trainInfo);
       
     }
     $('form')[0].reset();
   });

   //function to add a 'working' clock
   var update = () => {
     $('.currTime').html("Current Time: " +
       moment().format('hh:mm:ss A'));
     setInterval(update, 1000);
   }
   update();

   database.ref('train_info').on("child_added", function (childSnapshot) {
     //Ensures Time clonflicts over calc. microsecends
     var newTrain = moment(childSnapshot.val().firstTrain, "hh:mm")
       .subtract(1, "years");
    //finds difference between times
     var timeDifference = moment().diff(moment(newTrain), "minutes");
    //divides the difference with frequency to get remainder
     var remainder = timeDifference % childSnapshot.val().frequency;
    
     var minutesAway = childSnapshot.val().frequency - remainder;
    //end of calculation to find next train time.
     var nextTrain = moment().add(minutesAway, "minutes");
     var arrivalTime = moment(nextTrain).format("hh:mm A");

     let updateRow = () => {   //function to update(append)to the table
       $("#addRow").append("<tr><td>" + childSnapshot.val().name +
         "</td><td>" + childSnapshot.val().destination +
         "</td><td>" + childSnapshot.val().frequency +
         "</td><td>" + arrivalTime +
         "</td><td>" + minutesAway + "</td></tr>");
     }
     updateRow();


     //Figure out how to pull individual minutes away
     //it's grabbing last pushed obj to data bases time after decrement.
     /*let updateMins = () => {
       setInterval(function () {
         minutesAway--;
         //$('#addRow').find('td').eq(4).empty();
         $('#addRow').find('td').eq(4).text(minutesAway);
         // $('#addRow tr:nth-child(1)').append(minutesAway);
       }, 1000);
     }
     updateMins();*/

   }, (error) => {
     error.code
     console.log(error.code);
   });

   //adds a remove button clearing out all of the trains
   $("body").on('click', ".removebtn", function () {
     $(this).closest('tr').remove();
     let rmDatabase = $(this).parent().attr('id');
     database.ref('train_info').remove(rmDatabase);
   });

   
   $('.signIn').on('click', function() {
       event.preventDefault();
       console.log('I\'ve made it!');
       var provider = new firebase.auth.GoogleAuthProvider();
       firebase.auth().signInWithPopup(provider).then(function (result) {
         var credToken = result.credential.accessToken;
         var usr = result.user;

         console.log(credToken)
         console.log(usr)
       }).catch(function (error) {
         error.code, error.message;

         console.log(error.code)
         console.log(error.message)
       });
     });
     
 });