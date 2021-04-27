var uid, userName, mydocRef;
function show() {
    var query = location.search;
    var value = query.split('=');
    uid= value[1];
    if (uid.indexOf("?") != -1) {
        uid = uid.substring(0, uid.indexOf("?"));
    }

    var db = firebase.firestore();
    let collection = db.collection("account");
    collection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                userName = doc.data()['name'];
                $('#nameAccount').append('<button class="account" onclick="sendAccount()">' + userName + '</button>');
                mydocRef = db.collection("account").doc(doc.id);
                if (location.pathname != "/room.html") { // room.htmlではページ読み込み時の処理でmydocRef使わないのでコードそのままにしている
                    pageOnload();
                }
            }
            // console.log('アカウントがない');
            // window.location.href ='../index.html';
            // console.log(doc.data()['name']);
            // var name = doc.data()['name'];
            // $('#list').append('<li>'+ name + '</li>');
        })
    })
}
show();

function sendAccount (){
    window.location.href = '../account.html?name=' + encodeURIComponent(uid);
}

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = '../index.html';
    }).catch((error) => {
        // An error happened.
    });
}

function sendChangeProfile() {
    window.location.href ='../changeProfile.html?name=' + encodeURIComponent(uid);
}

function sendTimeTableUid() {
    window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
}
