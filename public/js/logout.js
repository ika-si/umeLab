function logout_chack(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          window.location.assign('./index.html');
          alert('logoutした');
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
  document.getElementById("logoutbtn").onclick = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signOut().then(function() {
        alert('logoutした');
        window.location.assign('./index.html');
        // logout_chack();
    }).catch(function(error) {
        //logout_chack();
    });
  };
  
});
  