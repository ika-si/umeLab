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
    $('#confirmStatus').append('<button type="button" class="delete BigCancelBtn" id="deleteBtn" onclick="confirmDelete()">' + "選択取消" + '</button><br><br>');
    $('#decideBtn').text("変更");
} else {
    // document.getElementById("confirmStatus").innerText = "時間割に追加したい授業を選択してください";
}

let selectedPeriod;     // "月曜1限"とか
let selectedId;         // t1m1101 とか
let selectedClassName;  // "哲学"とか教科名
let selectedTeacher;    // 先生の名前
let selectedTerm;       // ターム 1~4のいづれか
let selectedStyle;      // オンラインとか //
let selectedSubjectType; // 選択必修とか  //
let selectedCredit;     // 単位          //
let selectedUrl;        // URL           // 
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
                newCBinput.setAttribute('onclick', `clickBtn(${doc.data()['classId']}, '${doc.data()['id']}', '${doc.data()['name']}', '${doc.data()['teacher']}', '${doc.data()['term']}', '${doc.id}', '${doc.data()['style']}', '${doc.data()['subjectType']}', '${doc.data()['credit']}', '${doc.data()['url']}')`);
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

            newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'subjectType');
            newDetail.innerText = doc.data()['subjectType'];
            newRow1.appendChild(newDetail);

            newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'style');
            newDetail.innerText = doc.data()['style'];
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


function clickBtn(classId, id, name, teacher, term, classDocId, style, subjectType, credit, url){
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
            selectedStyle = style;
            selectedSubjectType = subjectType;
            selectedCredit = credit;
            selectedUrl = url;
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
            msg = `このクラスを選択しますか？\n${selectedPeriod}\n- ID：${selectedId} \n- 教科名：${selectedClassName} \n- 教授名：${selectedTeacher} \n- 授業区分：${selectedSubjectType} \n- 授業形態：${selectedStyle}`;
            break;
        }
    }
    if (window.confirm(msg)) {
    // confirm で ok が押された時の処理
        if (isChangeStatus) {
            deleteClassRegistration(true); // 更新の時この一行が実行される。この先でページ遷移する。addClassToMyClasses()もこの先で呼び出される
        } else if (isSomethingSelected) {
            addClassToMyClasses(); // addの時この一行が実行される呼び出し先で最終的にページ遷移する
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
            // console.log(docid);
            db.collection("rooms").doc(period).collection("classes").doc(classdocid).collection("users").doc(docid).delete().then(() => {
                console.log("Document successfully deleted!");
                // if (bool == false) { // 削除
                //     reduceCreditToMyCreditField1(); //ページ遷移もする
                // } else { // 更新
                //     reduceCreditToMyCreditField2(); //ページ遷移はまだしない
                // }
                reduceCreditToMyCreditField(bool);
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

function reduceCreditToMyCreditField(bool) {
    db.collection("account")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                var myaccountRef = db.collection("account").doc(doc.id);

                myaccountRef.get().then((doc) => {
                    if (doc.exists) {
                        // ->
                        db.collection("rooms").doc(period).collection("classes").doc(classdocid).get().then((doc2) => {
                            if (doc2.exists) {
                                let sbt = doc2.data()["subjectType"];
                                if (sbt == "必修科目") {

                                    return myaccountRef.update({
                                        // mustCount: Number(doc.data()["mustCount"]) - Number(selectedCredit)
                                        mustCount: Number(doc.data()["mustCount"]) - Number(doc2.data()["credit"])
                                    })
                                    .then(() => {
                                        console.log("Document successfully updated!");
                                        if (bool == false) {
                                            window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
                                        } else {
                                            addClassToMyClasses();
                                        }
                                    })
                                    .catch((error) => {
                                        // The document probably doesn't exist.
                                        console.error("Error updating document: ", error);
                                    });

                                } else if (sbt == "選択必修科目") {

                                    return myaccountRef.update({
                                        optionalCount: Number(doc.data()["optionalCount"]) - Number(doc2.data()["credit"])
                                    })
                                    .then(() => {
                                        console.log("Document successfully updated!");
                                        if (bool == false) {
                                            window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
                                        } else {
                                            addClassToMyClasses();
                                        }
                                    })
                                    .catch((error) => {
                                        // The document probably doesn't exist.
                                        console.error("Error updating document: ", error);
                                    });

                                } else if (sbt == "自由科目") {

                                    return myaccountRef.update({
                                        freeCount: Number(doc.data()["freeCount"]) - Number(doc2.data()["credit"])
                                    })
                                    .then(() => {
                                        console.log("Document successfully updated!");
                                        if (bool == false) {
                                            window.location.href ='../timetable.html?name=' + encodeURIComponent(uid);
                                        } else {
                                            addClassToMyClasses();
                                        }
                                    })
                                    .catch((error) => {
                                        // The document probably doesn't exist.
                                        console.error("Error updating document: ", error);
                                    });

                                }

                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.log("Error getting document:", error);
                        });

                        // <-
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
                    term: selectedTerm,
                    style: selectedStyle,
                    subjectType: selectedSubjectType,
                    url: selectedUrl,
                    credit: Number(selectedCredit)
                })
                .then(() => {
                    console.log("Document written with ID: ");
                    addCreditToMyCreditField();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
                // console.log("add myClasses =>", doc.data());
            }
        });
    });
}

function addCreditToMyCreditField() { // 自分の選択必修科目とかの単位数を更新していく関数
    db.collection("account")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                var myaccountRef = db.collection("account").doc(doc.id);

                myaccountRef.get().then((doc) => {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data());
                        if (selectedSubjectType == "必修科目") {

                            return myaccountRef.update({
                                mustCount: Number(doc.data()["mustCount"]) + Number(selectedCredit)
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid); // 先に処理が進んでしまうのここに書いた
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });

                        } else if (selectedSubjectType == "選択必修科目") {

                            return myaccountRef.update({
                                optionalCount: Number(doc.data()["optionalCount"]) + Number(selectedCredit)
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid); // 先に処理が進んでしまうのここに書いた
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });

                        } else if (selectedSubjectType == "自由科目") {

                            return myaccountRef.update({
                                freeCount: Number(doc.data()["freeCount"]) + Number(selectedCredit)
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid); // 先に処理が進んでしまうのここに書いた
                            })
                            .catch((error) => {
                                // The document probably doesn't exist.
                                console.error("Error updating document: ", error);
                            });

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