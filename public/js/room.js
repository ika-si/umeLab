let urlClass, period;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    urlClass = value[2];
    if (urlClass.indexOf("?") != -1) {
        urlClass = urlClass.substring(0, urlClass.indexOf("?"));
    }
    period = value[3];
    console.log(urlClass);
    console.log(period);
}
getClasses();


const db = firebase.firestore();
let usersRef; // getStudents() でコレクションが入る

function showRoomTitle() {
    db.collection('rooms').doc(period).collection('classes').doc(urlClass).get().then((doc) => {
        if (doc.exists) {
            let periodName = doc.data()['period'];
            let className = doc.data()['name'];
            let teacherName = doc.data()['teacher'];
            console.log(periodName +" "+ className +" "+ teacherName);
            document.getElementById("roomname").textContent = periodName +" - "+ className +" - ";
            document.getElementById("teachername").textContent = teacherName;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
}
showRoomTitle();


// let userlist = [
//     {uid:uid, name:userName},
//     {uid:"hogehogehoge1", name:"test1"},
//     {uid:"hogehogehoge2", name:"test2"}
// ]
// console.log(userlist);
// console.log(userlist[0].uid);
// console.log(userlist[0].name);

function getStudents() {
    usersRef = db.collection('rooms').doc(period).collection('classes').doc(urlClass).collection('users');

    // TODo: 配列とかオブジェクトとかにユーザー一覧を格納する処理を書く。
    //      studentごとのuidとnameのセットが必要。　かつ、自分がどれかを明確にさせる
    //      uid , userNameにすでに自分の情報が入っているみたい
    let myEmail, myUndergraduate, myDepartment, myGrade, myDetails, myTwitter, myInstagram;
    usersRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let myAccountUid = doc.data()['uid'];
            $('#memberlist').append('<a class="btn rounded-pill person" data-uid="'+ doc.data()['uid'] +'">' + doc.data()['name'] + '</a><br><br>');
            // $('#memberlist').append('<a class="btn rounded-pill person" onclick="showMemberInfo('+ myAccountUid+')">' + doc.data()['name'] + '</a><br><br>');
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

}
getStudents();


$(document).on("click", ".person", function (event) {
    alert('hello');
    // var otheruid = event.value;
    var otheruid = $(this).data('uid')
    console.log(otheruid);
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == otheruid) {
                console.log("Document data:", doc.data());
                console.log(doc.id, " => ", doc.data());
                userName = doc.data()['name'];
                myUndergraduate = doc.data()['undergraduate'];
                myDepartment = doc.data()['department'];
                myGrade = doc.data()['grade'];
                myDetails = doc.data()['details'];
                myTwitter = doc.data()['twitter'];
                myInstagram = doc.data()['instagram'];
                window.location.href='showAccount.html?usrName='+encodeURIComponent(userName)
                +'?myUndergraduate='+encodeURIComponent(myUndergraduate)
                +'?myDepartment='+encodeURIComponent(myDepartment)
                +'?myGrade='+encodeURIComponent(myGrade)
                +'?myDetails='+encodeURIComponent(myDetails)
                +'?myTwitter='+encodeURIComponent(myTwitter)
                +'?myInstagram='+encodeURIComponent(myInstagram)
            }
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
});