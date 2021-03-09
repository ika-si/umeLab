function signInWithEmailPassword() {
    let emailAdd = $("#emailAdd").val();
    if (emailAdd == "") return;

    let passwordAdd = $("#passwordAdd").val();
    if (passwordAdd == "") return;

    var email = emailAdd;
    var password = passwordAdd;

    // [START auth_signin_password]
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        // Signed in 
        console.log('signin');
        search(email);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#errorMessage').append("Error: "+errorMessage);
        $("#emailAdd").val('');
        $("#passwordAdd").val('');
      });
    // [END auth_signin_password]
}

function search(email) {
    var db = firebase.firestore();
    let collection = db.collection("account");
    collection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['email'] == email) {
                console.log('find');
                var uid = doc.data()['uid'];
                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
            }
            // console.log('アカウントがない');
            // window.location.href ='../index.html';
            // console.log(doc.data()['name']);
            // var name = doc.data()['name'];
            // $('#list').append('<li>'+ name + '</li>');
        })
    })
}

function signUpWithEmailPassword() {

    let nameAdd = $("#nameAdd").val();
    if (nameAdd == "") return;

    // 入力されたemailとpassword
    let emailAdd = $("#emailAdd").val();
    if (emailAdd == "") return;

    let passwordAdd = $("#passwordAdd").val();
    if (passwordAdd == "") return;

    var name = nameAdd;
    var email = emailAdd;
    var password = passwordAdd;

    // [START auth_signup_password]
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
        // Signed in 
        add(name);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        $('#errorMessage').append("Error: "+errorMessage);
        $("#nameAdd").val('');
        $("#emailAdd").val('');
        $("#passwordAdd").val('');
    });
    // [END auth_signup_password]
}

function add(nameAdd){
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
        uid: uidAdd
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        window.location.assign('../signin.html');
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function sendEmailVerification() {
    // [START auth_send_email_verification]
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        // Email verification sent!
        // ...
      });
    // [END auth_send_email_verification]
}
function sendPasswordReset() {
    let email = $("#emailAdd").val();
    if (email == "") return;
    
    // const email = "sam@example.com";
  // [START auth_send_password_reset]
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Password reset email sent!
      window.location.assign('../signin.html');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
  // [END auth_send_password_reset]
}
