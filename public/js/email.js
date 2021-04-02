// signIn

var signInFlag = true;
function signInWithGmail() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    var promise = search();
    promise.done(function() {
      if (signInFlag) {
        window.location.href ='../signup.html';
      }
    });
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
              signInFlag = false;
              window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
          }
      })
  })
  var defer = $.Deferred();
  setTimeout(function() {
    defer.resolve(); // 解決
  }, 3000);
  return defer.promise(); // プロミスを作って返す
}

// signUp

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
      window.location.href ='../timetable.html?name=' + encodeURIComponent(uidAdd);
  })
  .catch(function(error) {
       console.error("Error adding document: ", error);
  });
}

function searchEmail() {
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
  
  var univ_gmail = email.split('@');
  console.log(univ_gmail);
  if (univ_gmail[1] !== 'gm.tsuda.ac.jp') {
    alert("大学用アカウントを用いてください");
    window.stop();
    window.location.href ='../signup.html';
  }

  var db = firebase.firestore();
  let collection = db.collection("account");
  collection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data()['email'] == email) {
              console.log('find');
              signUpFlag = true;
              window.location.href ='../signin.html';
          }
      })
  })
 
  var defer = $.Deferred();
  setTimeout(function() {
    defer.resolve(); // 解決
  }, 3000);
  return defer.promise(); // プロミスを作って返す
}


var signUpFlag = false;
function add(nameAdd){

  var promise = searchEmail();
  promise.done(function() {
    if (!signUpFlag) {
      console.log(signUpFlag);
      dbEmail(nameAdd);
    }
  });

}

