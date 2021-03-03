function login_chack(){
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        alert('loginした');
        window.location.assign('./timetable.html');
      }else{
        alert('loginできない');
        window.location.assign('./index.html');
      }
  });            
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("login-btn").onclick = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      login_chack();
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log('error');
    });
  };
});
