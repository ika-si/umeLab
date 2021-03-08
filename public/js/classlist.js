const db = firebase.firestore();

let period, classdocid;
let isChangeStatus = false; // add->false, change->true
getFromURL();
function getFromURL() {
    // URLから取得
    let query = location.search;
    let value = query.split('=');
    period = value[2];
    if (period.indexOf("?") != -1) {
        period = period.substring(0, period.indexOf("?"));
        isChangeStatus = true;
    } else {
        // isChangeStatus = false;
    }
    classdocid = value[3];
    console.log(period);
    console.log(classdocid);
    console.log("クラス変更 ", isChangeStatus);
}

let isSomethingSelected = false; // 何かしら選択されているかどうか
$('#decideBtn').prop('disabled', true);


if (isChangeStatus) {
    document.getElementById("confirmStatus").innerText = "時間割表から選択済みのクラスを取り消したい場合は右のボタンを押してください　";
    $('#confirmStatus').append('<button type="button" class="delete" id="deleteBtn" onclick="confirmDelete()">' + "選択取消" + '</button><br><br>');
    $('#decideBtn').text("変更");
} else {
    // document.getElementById("confirmStatus").innerText = "時間割に追加したい授業を選択してください";
}

let selectedPeriod;     // "月曜1限"とか
let selectedId;         // t1m1101 とか
let selectedClassName;  // "哲学"とか教科名
let selectedTeacher;    // 先生の名前
let selectedTerm;       // ターム 1~4のいづれか
let selectedClassDocId; // rooms/.../classes/各クラスのドキュメントID　と account/.../myClasses/各履修クラスのドキュメントID　とを一致させるために rooms/.../classes/各クラスのドキュメントID を取得

displayClass();

function displayClass() {

    db.collection("rooms").doc(period).collection('classes').orderBy('classId').limit(1).get().then((querySnapshot) => { // 良い書き方が思い浮かばなかったがフィールドのperiodの値を取り出している
        querySnapshot.forEach((doc) => {
            document.getElementById("openingClass").textContent = doc.data()['period'];
            selectedPeriod = doc.data()['period'];
            // console.log("[開講曜日・時限]" + selectedPeriod);
        });
    });


    db.collection("rooms").doc(period).collection('classes').orderBy('classId').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()['id']}`);
            // console.log(`${doc.id} => ${doc.data()['name']}`);

            // let parent = document.getElementsByClassName("classtable")[0];
            let parent = document.classtable;

            let newRow1 = document.createElement('div');
            newRow1.setAttribute('class', 'classDetail');

            let newCB = document.createElement('div');
            newCB.setAttribute('class', 'form-check form-switch');
            newCB.setAttribute('id', 'checkBtn');

                let newCBinput = document.createElement('input');
                newCBinput.setAttribute('class', 'form-check-input');
                newCBinput.setAttribute('type', 'checkbox');
                newCBinput.setAttribute('id', `checkbox${doc.data()['classId']}`);
                newCBinput.setAttribute('name', 'className');
                newCBinput.setAttribute('onclick', `clickBtn(${doc.data()['classId']}, '${doc.data()['id']}', '${doc.data()['name']}', '${doc.data()['teacher']}', '${doc.data()['term']}', '${doc.id}')`);
                let newCBlabel = document.createElement('label');
                newCBlabel.setAttribute('class', 'form-check-label');
                newCBlabel.setAttribute('for', 'flexSwitchCheckDefault');
                newCB.appendChild(newCBinput);
                newCB.appendChild(newCBlabel);

            newRow1.appendChild(newCB);

            let newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'subjectID');
            newDetail.innerText = doc.data()['id'];
            newRow1.appendChild(newDetail);

            newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'subjectName');
            newDetail.innerText = doc.data()['name'];
            newRow1.appendChild(newDetail);

            newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'professor');
            newDetail.innerText = doc.data()['teacher'];
            newRow1.appendChild(newDetail);

            parent.appendChild(newRow1);
            // console.log(parent);

        });
    });
}

if (isChangeStatus) {
    lockCheckbox();
}
let boxNum;
function lockCheckbox() {
    // 変更前のクラスのcheckboxをcheckを入れて変更できないようにする。色も変えたい。
    db.collection("rooms").doc(period).collection("classes").doc(classdocid).get().then((doc) => {
        if (doc.exists) {
            const className = document.classtable.className;
            className[doc.data()["classId"]].checked = true;
            className[doc.data()["classId"]].disabled = true;
            boxNum = doc.data()["classId"];
            // console.log("id=checkbox" + doc.data()["classId"] + " のcheckboxにチェックがはいった");
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function clickBtn(classId, id, name, teacher, term, classDocId){
    if (isChangeStatus) {
        lockCheckbox();
    }
    const className = document.classtable.className;
    isSomethingSelected = false;
    for (let i = 0; i < className.length; i++){
        if (isChangeStatus && i == boxNum) {
            continue;
        } 
        if (className[i].id == "checkbox"+classId){
            selectedId = id;
            selectedClassName = name;
            selectedTeacher = teacher;
            selectedTerm = term;
            selectedClassDocId = classDocId;
            isSomethingSelected = className[i].checked;
            checkDecideBtn(); // $('#decideBtn').prop('disabled', !isSomethingSelected);
            console.log("isSomethingSelected: " + isSomethingSelected);
            console.log("now select -> id: " + id + "  name: " + name + "  teacher: " + teacher);
            continue;
        }
        className[i].checked = false;
    }
}

function checkDecideBtn() {
    if (isSomethingSelected) {
        $('#decideBtn').prop('disabled', false);
    } else {
        $('#decideBtn').prop('disabled', true);
    }
}

function confirmClass(){
    const className = document.classtable.className;
    let msg = "";
    // confirm表示メッセージの用意
    for (let i = 0; i < className.length; i++){
        if(className[i].checked){
            // console.log(className[i]);
            msg = `このクラスを選択しますか？\n${selectedPeriod}\n- ID：${selectedId} \n- 教科名：${selectedClassName} \n- 教授名：${selectedTeacher}`;
            break;
        }
    }
    if (window.confirm(msg)) {
    // confirm で ok が押された時の処理
        if (isChangeStatus) {
            deleteClassRegistration(true);
        }
        if (isSomethingSelected) {
            addClassToMyClasses(); // -> 呼び出し先で最終的にページ遷移する
        }
    }
}


// 以下は、Firestoreにデータを追加・削除する関数　ページ遷移もある

function confirmDelete() {
    if(window.confirm("このクラスを時間割表から取り消しますか？")) {
        deleteClassRegistration(false);
    }
}

function deleteClassRegistration(bool) { // account/.../myClasses/からドキュメントを消す、rooms/.../classdocid を消す
    deleteClassFromMyClasses(bool);
    // deleteUserFromClassUsers();
}
function deleteClassFromMyClasses(bool) {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                db.collection("account").doc(doc.id).collection("myClasses").doc(classdocid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    deleteUserFromClassUsers(bool);
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }
        });
    });
}
function deleteUserFromClassUsers(bool) {
    db.collection("rooms").doc(period).collection("classes").doc(classdocid).collection("users").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let docid = doc.id;
            console.log(docid);
            db.collection("rooms").doc(period).collection("classes").doc(classdocid).collection("users").doc(docid).delete().then(() => {
                console.log("Document successfully deleted!");
                if (bool == false) { // 更新ならページ遷移する
                    window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
                }
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}


function addClassToMyClasses() {
    // rooms/.../users にuidフィールドを持ったドキュメントを追加  履修者一覧を表示するときに使う
    db.collection("rooms").doc(period).collection("classes")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data()['id'] == selectedId) {
                db.collection("rooms").doc(period).collection("classes").doc(doc.id).collection("users").add({
                    uid: uid,
                    name: userName
                })
                .then(() => {
                    console.log("Document written with ID: ");
                    addUserToClassUsers();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }
        });
    });
}

function addUserToClassUsers() {
    // rooms/.../classes/各クラスのドキュメント と同じドキュメントを account/.../myClasses/下につくる
    db.collection("account")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                db.collection("account").doc(doc.id).collection("myClasses").doc(selectedClassDocId).set({
                    room: decodeURIComponent(period),
                    id: selectedId,
                    name: selectedClassName,
                    period: selectedPeriod,
                    teacher: selectedTeacher,
                    term: selectedTerm
                })
                .then(() => {
                    console.log("Document written with ID: ");
                    window.location.href ='../timetable.html?name=' + encodeURIComponent(uid); // 先に処理が進んでしまうのここに書いた
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
                console.log("add myClasses =>", doc.data());
            }
        });
    });
}