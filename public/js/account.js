var userName;
function show() {
    var query = location.search;
    var value = query.split('=');
    userName = value[1];
    console.log(decodeURIComponent(userName));
    $('#nameAccount').append('<li>' + userName + '</li>');
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

function userSend() {
    window.location.href ='../chat.html?name=' + encodeURIComponent(userName);
}