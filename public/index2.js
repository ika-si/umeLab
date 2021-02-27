function logout_chack(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          window.location.assign('./index.html');
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
  document.getElementById("logoutbtn").onclick = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signOut(provider).then(function(result) {
        logout_chack();
    }).catch(function(error) {
        //logout_chack();
    });
  };
  
});
  