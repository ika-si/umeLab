let year_term_period, id, year;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    year_term_period = value[2];
    if (year_term_period.indexOf("?") != -1) {
        year_term_period = year_term_period.substring(0, year_term_period.indexOf("?"));
    }
    id = value[3];
    year = year_term_period.substring(0,4);
    console.log(year);
    console.log(year_term_period);
    console.log(id);
}
getClasses();


const db = firebase.firestore();
let usersRef; // getStudents() でコレクションが入る

function showRoomTitle() {
    db.collection("year").doc(year).collection("classes").doc(id).get().then((doc) => {
        if (doc.exists) {
            let periodName;
            if (year_term_period.substring(6,9) == 'Mon') {
                periodName = "月曜" + year_term_period.substring(9) + "限";
            } else if (year_term_period.substring(6,9) == 'Tue') {
                periodName = "火曜" + year_term_period.substring(9) + "限";
            } else if (year_term_period.substring(6,9) == 'Wed') {
                periodName = "水曜" + year_term_period.substring(9) + "限"
            } else if (year_term_period.substring(6,9) == 'Thu') {
                periodName = "木曜" + year_term_period.substring(9) + "限";
            } else {
                periodName = "金曜" + year_term_period.substring(9) + "限";
            }

            let className = doc.data()['name']; //
            let teacherName = doc.data()['teacher']; //
            let classStyle = doc.data()['style']; //
            let classUrl = doc.data()['url']; //
            console.log(periodName +" "+ className +" "+ teacherName +" "+ classStyle +" "+ classUrl);
            document.getElementById("roomname").textContent = periodName +" - "+ className +" - ";
            document.getElementById("teachername").textContent = "　　教授名　：" + teacherName;
            document.getElementById("roomStyle").textContent = "　　授業形態：" + classStyle;
            if (classStyle == "オンライン" || classStyle == "ハイブリッド") {
                // document.getElementById("classUrlSpace").innerHTML = `　　授業URL  ： <a href="${classUrl}" target="_blank">${classUrl}</a>`;
                document.getElementById("classUrlSpace").innerHTML = `　　授業URL  ： <a href="https://sites.google.com/tsuda.ac.jp/online-class-timetable" target="_blank">${classUrl}</a>`; // ComingSoon の時はとりあえずオンライン授業時間割に飛ぶようにしておく
            }
            // console.log(document.getElementById("roomDetail"));
            showStudents();
            // showChat();
    
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
showRoomTitle();


function showStudents() {
    usersRef = db.collection('year').doc(year).collection('classes').doc(id).collection('users');
    usersRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data()['name']);
            $('#memberlist').append('<a class="btn rounded-pill person" data-uid="'+ doc.data()['uid'] +'">' + doc.data()['name'] + '</a><br><br>');
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}



$(document).on("click", ".person", function (event) {
    let otheruid = $(this).data('uid');
    let myUndergraduate, myDepartment, myGrade, myDetails, myTwitter, myInstagram;
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == otheruid) {
                // console.log("Document data:", doc.data());
                // console.log(doc.id, " => ", doc.data());
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