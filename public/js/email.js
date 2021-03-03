function signInWithEmailPassword() {
    // let emailAdd = $("#emailAdd").val();
    // if (emailAdd == "") return;

    // let passwordAdd = $("#passwordAdd").val();
    // if (passwordAdd == "") return;

    // var email = emailAdd;
    // var password = passwordAdd;

    var email = 'yurika.sugai@gmail.com';
    var password = 'yurika';
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
      });
    // [END auth_signin_password]
}

function search(email) {
    var db = firebase.firestore();
    let collection = db.collection("users");
    collection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['email'] == "yurika.sugai@gmail.com") {
                console.log('find');
                var name = doc.data()['name'];
                $('#list').append('<li>'+ name + '</li>');
                window.location.href ='../done.html?name=' + encodeURIComponent(name);
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

    // var name = 'y';
    // var email = 'yurika.sugai@gmail.com';
    // var password = 'yurika';
    // [START auth_signup_password]
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
        // Signed in 
        add(name,email);
    }).catch((error) => {
        console.log('すでにアカウントが存在します');
        var errorCode = error.code;
        var errorMessage = error.message;
        $("#nameAdd").val('');
        $("#emailAdd").val('');
        $("#passwordAdd").val('');
    });
    // [END auth_signup_password]
}

function add(nameAdd,emailAdd){
    var db = firebase.firestore();
    db.collection("users").add({
        name: nameAdd,
        email: emailAdd
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
    var email = "test@example.com";
    var password = "hunter2";
    // [START auth_signin_password]
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
          console.log('signin');
          window.location.assign('../done.html');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
    // [END auth_signin_password]
}
