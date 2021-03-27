function signInWithGmail() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    search();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    $('#errorMessage').append("Error: "+errorMessage);
    $("#nameAdd").val('');
  });
}

function search() {
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid, emailVerified;

  if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
  }
  var db = firebase.firestore();
  let collection = db.collection("account");
  collection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data()['email'] == email) {
              console.log('find');
              var uid = doc.data()['uid'];
              window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
          }
      })
  })
  $('#errorMessage').append("signupしてください");
}

function signUpWithGmail() {

    let nameAdd = $("#nameAdd").val();
    if (nameAdd == "") return;

    var name = nameAdd;

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      add(name);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      $('#errorMessage').append("Error: "+errorMessage);
      $("#nameAdd").val('');
    });
}

var flag = false;
async function add(nameAdd){
  
  try {
    console.log(flag);
    searchEmail()
  } catch (error) {
    console.log(error);
  } finally {
    if (flag) {
      console.log(flag);
      dbEmail(nameAdd);
    }
  }

}

function dbEmail(nameAdd) {
  var user = firebase.auth().currentUser;
  var emailAdd,uidAdd;
  
  if (user != null) {
    emailAdd = user.email;
    uidAdd = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
  }
  var db = firebase.firestore();
  db.collection("account").add({
      name: nameAdd,
      email: emailAdd,
      uid: uidAdd,
      undergraduate: "",
      department: "",
      grade: -1,
      twitter: "",
      instagram: "",
      details: "",
      freeCount: 0,
      mustCount: 0,
      optionalCount: 0
  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
  })
  .catch(function(error) {
       console.error("Error adding document: ", error);
  });
}

function searchEmail() {
  var user = firebase.auth().currentUser;
  var email;
  if (user != null) {
    email = user.email;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
  }
  console.log(email);
  var db = firebase.firestore();
  let collection = db.collection("account");
  collection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data()['email'] == email) {
              console.log('find');
              flag = true;
              window.location.href ='../signin.html';
          }
      })
  })
  // $('#errorMessage').append("すでにアカウントがあります");
}