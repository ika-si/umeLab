const db = firebase.firestore();

setYearcontainsTermPeriod();

let period, classId; //period:2021T1Mon1とか classId:20210001とか
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
    classId = value[3];
    console.log(period);
    console.log(classId);
    console.log("クラス変更 ", isChangeStatus);
}
const year = period.substring(0,4); // 2021
let lastClassdocid; // 変更の時に使用する、選択済みクラスのdoc.id
let countUpData = 0;
let lockCheckboxNum;
let isSomethingSelected = false; // 何かしら選択されているかどうか
$('#decideBtn').prop('disabled', true);


if (isChangeStatus) {
    document.getElementById("confirmStatus").innerText = "時間割表から選択済みのクラスを取り消したい場合は右のボタンを押してください　";
    $('#confirmStatus').append('<button type="button" class="delete BigCancelBtn" id="deleteBtn" onclick="confirmDelete()">' + "選択取消" + '</button><br><br>');
    $('#decideBtn').text("変更");
} else {
    // document.getElementById("confirmStatus").innerText = "時間割に追加したい授業を選択してください";
}

let selectedClassdocid; // doc.id
let selectedPeriod;     // "月曜1限"とか
let selectedId;         // t1m1101 とか
let selectedClassId;    // 20210001 とか
let selectedClassName;  // "哲学"とか教科名
let selectedTeacher;    // 先生の名前
let selectedTerm;       // ターム 1~4のいづれか
let selectedStyle;      // オンラインとか
let selectedCredit;     // 単位
let selectedUrl;        // URL

displayClass();

function displayClass() {

    // 時限タイトル表示
    if (period.substring(6,9) == 'Mon') {
        selectedPeriod = "月曜" + period.substring(9) + "限";
    } else if (period.substring(6,9) == 'Tue') {
        selectedPeriod = "火曜" + period.substring(9) + "限";
    } else if (period.substring(6,9) == 'Wed') {
        selectedPeriod = "水曜" + period.substring(9) + "限"
    } else if (period.substring(6,9) == 'Thu') {
        selectedPeriod = "木曜" + period.substring(9) + "限";
    } else {
        selectedPeriod = "金曜" + period.substring(9) + "限";
    }
    document.getElementById("openingClass").textContent = selectedPeriod;

    db.collection("years").doc(year).collection('classes').where(period.substring(4), "==", true).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (isChangeStatus && doc.data()["classId"] == classId) { // 変更ステータスで、選択中クラスのclassIdが見つかったとき
                lastClassdocid = doc.id;
                console.log(lastClassdocid);
                lockCheckboxNum = countUpData;
                countUpData++;
            }
            countUpData++;

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
                newCBinput.setAttribute('onclick', `clickBtn('${doc.id}', ${doc.data()['classId']}, '${doc.data()['id']}', '${doc.data()['name']}', '${doc.data()['teacher']}', '${doc.data()['term']}', '${doc.data()['style']}', '${doc.data()['credit']}', '${doc.data()['url']}')`);
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
            newDetail.setAttribute('id', 'credit');
            newDetail.innerText = doc.data()['credit'];
            newRow1.appendChild(newDetail);

            newDetail = document.createElement('div');
            newDetail.setAttribute('class', 'form-check form-switch');
            newDetail.setAttribute('id', 'style');
            newDetail.innerText = doc.data()['style'];
            newRow1.appendChild(newDetail);

            parent.appendChild(newRow1);
            // console.log(parent);

            // 履修追加できないようにスイッチを切り替えられなくする
            const tpArr = doc.data()['termPeriodArr'];
            console.log(tpArr);
            checkCanAddClass(tpArr, countUpData);
        });
        if (isChangeStatus) {
            lockCheckbox();
        }
    });
}
function checkCanAddClass(tpArr, countUpData) {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                let canAddClass = true;
                const myYearContain = doc.data()["y2021Contain"];
                const weekArr = ["Mon", "Tue", "Wed", "Thu", "Fri"];

                for (let term=1; term<=4; term++) {
                    for (let i=0; i<weekArr.length; i++) {
                        for (let j=1; j<=6; j++) {
                            for (let ta=0; ta<tpArr.length; ta++) {
                                // console.log(`${myYearContain}.T${term}${weekArr[i]}${j}`);
                                // console.log(myYearContain.T1Mon1);
                                if (`${myYearContain}.T${term}${weekArr[i]}${j}` == tpArr[ta]) {
                                    canAddClass = false;
                                }
                            }
                        }
                    }
                }
                if (canAddClass == false) {
                    const className = document.classtable.className;
                    className[countUpData-1].disabled = true;
                }
                // return canAddClass;
            }
        });
    });
}

function lockCheckbox() {
    // 変更前のクラスのcheckboxをcheckを入れて変更できないようにする。
    db.collection("years").doc(year).collection("classes").doc(lastClassdocid).get().then((doc) => {
        if (doc.exists) {
            const className = document.classtable.className;
            className[lockCheckboxNum].checked = true;
            className[lockCheckboxNum].disabled = true;
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


function clickBtn(docid, cId, id, name, teacher, term, style, credit, url){
    if (isChangeStatus) {
        lockCheckbox();
    }
    const className = document.classtable.className;
    isSomethingSelected = false;
    for (let i = 0; i < className.length; i++){
        if (isChangeStatus && i == lockCheckboxNum) {
            continue;
        }
        if (className[i].id == "checkbox"+cId){
            selectedClassdocid = docid;
            selectedId = id;
            selectedClassId = cId;
            selectedClassName = name;
            selectedTeacher = teacher;
            selectedTerm = term;
            selectedStyle = style;
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
            msg = `このクラスを選択しますか？\n${period.substring(4,6)} ${selectedPeriod}\n- 時間割コード：${selectedId} \n- 教科名：${selectedClassName} \n- 教員名：${selectedTeacher} \n- 単位数：${selectedCredit} \n- 授業形態：${selectedStyle}`;
            break;
        }
    }
    if (window.confirm(msg)) {
    // confirm で ok が押された時の処理
        if (isChangeStatus) {
            deleteClassRegistration(true); // 更新の時この一行が実行される。この先でページ遷移する。addUserToClassUsers()もこの先で呼び出される
        } else if (isSomethingSelected) {
            addUserToClassUsers(); // addの時この一行が実行される呼び出し先で最終的にページ遷移する
        }
    }
}


function confirmDelete() {
    if(window.confirm("このクラスを時間割表から取り消しますか？")) {
        deleteClassRegistration(false);
    }
}

function deleteClassRegistration(bool) {
    deleteClassFromMyClasses(bool);
}
function deleteClassFromMyClasses(bool) {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                // クラス配列フィールドから当てはまるclassIdを削除する
                db.collection("account").doc(doc.id).update({
                    y2021MyClasses: firebase.firestore.FieldValue.arrayRemove(Number(classId))
                })
                .then(() => {
                    console.log("Document successfully updated!");
                    deleteUserFromClassUsers(bool);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        });
    });
}
function deleteUserFromClassUsers(bool) {
    db.collection("years").doc(year).collection("classes").doc(lastClassdocid).collection("users").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id);
            db.collection("years").doc(year).collection("classes").doc(lastClassdocid).collection("users").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");

                if (bool == false) {
                    window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(period.substring(4,6));
                } else {
                    addUserToClassUsers();
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

function addUserToClassUsers() {
    // years/.../users にuidフィールドを持ったドキュメントを追加  履修者一覧を表示するときに使う
    console.log(selectedClassdocid);
    db.collection("years").doc(year).collection("classes").doc(selectedClassdocid).collection("users").add({
        uid: uid,
        name: userName
    })
    .then(() => {
        console.log("Document written with ID: ");
        addClassToMyClasses();
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function addClassToMyClasses() {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {

                db.collection('account').doc(doc.id)
                .get().then((doc2) => {
                    if (doc2.exists) {
                        if (typeof doc2.data()["y2021MyClasses"] === 'undefined') {
                            // 新しく配列フィールドを作成して追加
                            db.collection('account').doc(doc2.id).set({
                                y2021MyClasses: [selectedClassId]
                            }, {merge: true})
                            .then(() => {
                                console.log("Document successfully written!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(period.substring(4,6));
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            // 既にある配列フィールドに追加
                            db.collection('account').doc(doc2.id).update({
                                y2021MyClasses: firebase.firestore.FieldValue.arrayUnion(selectedClassId)
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(period.substring(4,6));
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                            });
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        });
    });
}


//

function setYearcontainsTermPeriod() {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {

                db.collection('account').doc(doc.id)
                .get().then((doc2) => {
                    if (doc2.exists) {
                        if (typeof doc2.data()["y2021Contain"] === 'undefined') {
                            // 新しく配列フィールドを作成して追加
                            db.collection('account').doc(doc2.id).set({
                                y2021Contain: {
                                    T1Mon1: false,
                                    T1Mon2: false,
                                    T1Mon3: false,
                                    T1Mon4: false,
                                    T1Mon5: false,
                                    T1Mon6: false,

                                    T2Mon1: false,
                                    T2Mon2: false,
                                    T2Mon3: false,
                                    T2Mon4: false,
                                    T2Mon5: false,
                                    T2Mon6: false,

                                    T3Mon1: false,
                                    T3Mon2: false,
                                    T3Mon3: false,
                                    T3Mon4: false,
                                    T3Mon5: false,
                                    T3Mon6: false,

                                    T4Mon1: false,
                                    T4Mon2: false,
                                    T4Mon3: false,
                                    T4Mon4: false,
                                    T4Mon5: false,
                                    T4Mon6: false,


                                    T1Tue1: false,
                                    T1Tue2: false,
                                    T1Tue3: false,
                                    T1Tue4: false,
                                    T1Tue5: false,
                                    T1Tue6: false,

                                    T2Tue1: false,
                                    T2Tue2: false,
                                    T2Tue3: false,
                                    T2Tue4: false,
                                    T2Tue5: false,
                                    T2Tue6: false,

                                    T3Tue1: false,
                                    T3Tue2: false,
                                    T3Tue3: false,
                                    T3Tue4: false,
                                    T3Tue5: false,
                                    T3Tue6: false,

                                    T4Tue1: false,
                                    T4Tue2: false,
                                    T4Tue3: false,
                                    T4Tue4: false,
                                    T4Tue5: false,
                                    T4Tue6: false,


                                    T1Wed1: false,
                                    T1Wed2: false,
                                    T1Wed3: false,
                                    T1Wed4: false,
                                    T1Wed5: false,
                                    T1Wed6: false,

                                    T2Wed1: false,
                                    T2Wed2: false,
                                    T2Wed3: false,
                                    T2Wed4: false,
                                    T2Wed5: false,
                                    T2Wed6: false,

                                    T3Wed1: false,
                                    T3Wed2: false,
                                    T3Wed3: false,
                                    T3Wed4: false,
                                    T3Wed5: false,
                                    T3Wed6: false,

                                    T4Wed1: false,
                                    T4Wed2: false,
                                    T4Wed3: false,
                                    T4Wed4: false,
                                    T4Wed5: false,
                                    T4Wed6: false,


                                    T1Thu1: false,
                                    T1Thu2: false,
                                    T1Thu3: false,
                                    T1Thu4: false,
                                    T1Thu5: false,
                                    T1Thu6: false,

                                    T2Thu1: false,
                                    T2Thu2: false,
                                    T2Thu3: false,
                                    T2Thu4: false,
                                    T2Thu5: false,
                                    T2Thu6: false,

                                    T3Thu1: false,
                                    T3Thu2: false,
                                    T3Thu3: false,
                                    T3Thu4: false,
                                    T3Thu5: false,
                                    T3Thu6: false,

                                    T4Thu1: false,
                                    T4Thu2: false,
                                    T4Thu3: false,
                                    T4Thu4: false,
                                    T4Thu5: false,
                                    T4Thu6: false,


                                    T1Fri1: false,
                                    T1Fri2: false,
                                    T1Fri3: false,
                                    T1Fri4: false,
                                    T1Fri5: false,
                                    T1Fri6: false,

                                    T2Fri1: false,
                                    T2Fri2: false,
                                    T2Fri3: false,
                                    T2Fri4: false,
                                    T2Fri5: false,
                                    T2Fri6: false,
                                    
                                    T3Fri1: false,
                                    T3Fri2: false,
                                    T3Fri3: false,
                                    T3Fri4: false,
                                    T3Fri5: false,
                                    T3Fri6: false,
                                    
                                    T4Fri1: false,
                                    T4Fri2: false,
                                    T4Fri3: false,
                                    T4Fri4: false,
                                    T4Fri5: false,
                                    T4Fri6: false
                                }
                            }, {merge: true})
                            .then(() => {
                                console.log("Document successfully written!");
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            //
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        });
    });
}