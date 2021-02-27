function login_chack(){
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location.assign('./index2.html');
        //   document.getElementById("login-status").value="login"
      }else{
          document.getElementById("login-status").value="not logged"
      }
  });            
}

document.addEventListener('DOMContentLoaded', function() {
// 1st check
// login_chack();

// wite
document.getElementById("login-btn").onclick = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
      login_chack();
  }).catch(function(error) {
      login_chack();
  });
};

});
