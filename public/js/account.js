function show() {
    var query = location.search;
    var value = query.split('=');
    
    console.log(decodeURIComponent(value[1]));
    $('#list').append('<li>'+ value[1] + '</li>');
}
show();

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = '../index.html';
      }).catch((error) => {
        // An error happened.
    });
}
