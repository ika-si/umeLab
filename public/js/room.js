let year_term_period, classId, year, classdocid;
function getClasses() {
    // URLから授業情報を取得
    let query = location.search;
    let value = query.split('=');
    year_term_period = value[2];
    if (year_term_period.indexOf("?") != -1) {
        year_term_period = year_term_period.substring(0, year_term_period.indexOf("?"));
    }
    classId = value[3];
    year = classId.substring(0,4);
    console.log(year);
    console.log(year_term_period);
    console.log(classId);
}
getClasses();


const db = firebase.firestore();
let usersRef; // getStudents() でコレクションが入る

function showRoomTitle() {

    db.collection('years').doc(year).collection('classes').where("classId", "==", Number(classId))
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let periodName;
            // console.log(year_term_period.substring(6,9));
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
            // let periodName = doc.data()['period'];
            let className = doc.data()['name']; //
            let teacherName = doc.data()['teacher']; //
            let classStyle = doc.data()['style']; //
            let classUrl = doc.data()['url']; //
            console.log(periodName +" "+ className +" "+ teacherName +" "+ classStyle +" "+ classUrl);
            document.getElementById("roomname").textContent = periodName +" - "+ className +" - ";
            document.getElementById("teachername").textContent = "　　教授名　：" + teacherName;
            document.getElementById("roomStyle").textContent = "　　授業形態：" + classStyle;
            if (classStyle == "オンライン" || classStyle == "ハイブリッド") {
                document.getElementById("classUrlSpace").innerHTML = `　　授業URL  ： <a href="${classUrl}" target="_blank">${classUrl}</a>`;
            }
            // console.log(document.getElementById("roomDetail"));
            classdocid = doc.id;
            console.log(classdocid);
            showStudents();
            showChat();
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}
showRoomTitle();

// function getStudents() {
//     let classdocid;
//     db.collection('years').doc(year).collection('classes').where("classId", "==", Number(classId))
//     .get().then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             // usersRef = doc.collection('users');
//             classdocid = doc.id;
//             // console.log(usersRef);
//             console.log(classdocid);
//         });
//     })
//     .catch((error) => {
//         console.log("Error getting documents: ", error);
//     });
//     if(classdocid !== 'undefined') {
//         console.log("find");
//         console.log(classdocid);
//         showStudents(classdocid);
//     }
// }
// getStudents();

function showStudents() {
    usersRef = db.collection('years').doc(year).collection('classes').doc(classdocid).collection('users');
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