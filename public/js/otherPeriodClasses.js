const db = firebase.firestore();

let otherPeriodClassArr = [];
let my2021ClassesArr = [];
let myOPClassArr = [];

getOtherPeriodClassArr();

function getOtherPeriodClassArr() {
    db.collection("year").doc("2021").get().then((doc) => {
        if (doc.exists) {
            otherPeriodClassArr = doc.data()["otherPeriodArr"];
            getMy2021ClassesArr();
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function getMy2021ClassesArr() {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                db.collection('account').doc(doc.id)
                .get().then((doc2) => {
                    if (doc2.exists) {
                        if (typeof doc2.data()["y2021MyClasses"] === 'undefined') {
                            // my2021ClassesArr = [];
                        } else {
                            my2021ClassesArr = doc2.data()["y2021MyClasses"];
                            getMyOPClassArr();
                        }
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        });
    });
}

function getMyOPClassArr() {
    for (let j=0; j<my2021ClassesArr.length; j++) {
        if (otherPeriodClassArr.includes(String(my2021ClassesArr[j]))) {
            myOPClassArr.push(String(my2021ClassesArr[j]));
        }
    }
    console.log(myOPClassArr);
    if (myOPClassArr != []) {
        displayMyOPClasses(0);
    }
}

function displayMyOPClasses(i) {
    db.collection("year").doc("2021").collection("classes").doc(myOPClassArr[i]).get()
    .then((doc) => {
        if (doc.exists) {
            let parent = document.getElementById("otherPeriodList");


            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'opClassDetail');

            let nameText = document.createElement('div');
            nameText.innerText = doc.data()["name"];
            newRow.appendChild(nameText);
            
            let teacherText = document.createElement('div');
            teacherText.innerText = doc.data()["teacher"];
            newRow.appendChild(teacherText);

            let roomBtn = document.createElement('button');
            roomBtn.setAttribute('type', 'button');
            roomBtn.innerText = "room";
            roomBtn.setAttribute('onclick', `userSendRoom('${myOPClassArr[i]}')`);
            newRow.appendChild(roomBtn);

            let deleteBtn = document.createElement('button');
            deleteBtn.setAttribute('type', 'button');
            deleteBtn.innerText = "履修取消";
            deleteBtn.setAttribute('onclick', `confirmDelete('${myOPClassArr[i]}')`);
            newRow.appendChild(deleteBtn);
            

            parent.appendChild(newRow);
            console.log(parent);
            

        } else {
            console.log("No such document!");
        }
        // 次のクラスの一行表示を行う
        if (i + 1 < myOPClassArr.length) {
            displayMyOPClasses(i + 1);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function userSendRoom(classId) {
    window.location.href ='../room.html?name=' + encodeURIComponent(uid) + "?period=2021otherPeriod?id=" + encodeURIComponent(classId);
}

function confirmDelete(classId) {
    if(window.confirm("このクラスを時間割表から取り消しますか？")) {
        // deleteClassRegistration(false);
        deleteClassFromMyClasses(classId);
    }
}

function deleteClassFromMyClasses(classId) {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                // クラス配列フィールドから当てはまるclassIdを削除する
                db.collection("account").doc(doc.id).update({
                    y2021MyClasses: firebase.firestore.FieldValue.arrayRemove(Number(classId))
                })
                .then(() => {
                    console.log("Document successfully updated!");
                    deleteUserFromClassUsers(classId);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        });
    });
}

function deleteUserFromClassUsers(classId) {
    db.collection("year").doc("2021").collection("classes").doc(classId).collection("users").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id);
            db.collection("year").doc("2021").collection("classes").doc(classId).collection("users").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");

                window.location.href ='../otherPeriodClasses.html?name=' + encodeURIComponent(uid);

            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}