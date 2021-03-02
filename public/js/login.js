function login_chack(){
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        alert('loginした');
        window.location.assign('./timetable.html');
        //   document.getElementById("login-status").value="login"
      }else{
          //document.getElementById("login-status").value="not logged"
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
      console.log("error");
      //login_chack();
  });
};

});
