const db = firebase.firestore();

setYearcontainsTermPeriod();

let year_term_period, classId; //period:2021T1Mon1とか classId:20210001 とか
let isChangeStatus = false; // add->false, change->true
getFromURL();
function getFromURL() {
    // URLから取得
    let query = location.search;
    let value = query.split('=');
    year_term_period = value[2];
    if (year_term_period.indexOf("?") != -1) {
        year_term_period = year_term_period.substring(0, year_term_period.indexOf("?"));
        isChangeStatus = true;
    } else {
        // isChangeStatus = false;
    }
    classId = value[3];
    console.log(year_term_period);
    console.log(classId);
    console.log("クラス変更 ", isChangeStatus);
}
const year = year_term_period.substring(0,4); // 2021
let lastTermPeriodArr;
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

let selectedClassdocid; // doc.id  11J01
let selectedPeriod;     // "月曜1限"とか
let selectedTermPeriodArr; // T1Mon1とかの配列

let thisTPClassArr;
showClassTitle();
getTPClassArr();

function showClassTitle() {
    // 時限タイトル表示
    if (year_term_period.substring(6,9) == 'Mon') {
        selectedPeriod = "月曜" + year_term_period.substring(9) + "限";
    } else if (year_term_period.substring(6,9) == 'Tue') {
        selectedPeriod = "火曜" + year_term_period.substring(9) + "限";
    } else if (year_term_period.substring(6,9) == 'Wed') {
        selectedPeriod = "水曜" + year_term_period.substring(9) + "限"
    } else if (year_term_period.substring(6,9) == 'Thu') {
        selectedPeriod = "木曜" + year_term_period.substring(9) + "限";
    } else {
        selectedPeriod = "金曜" + year_term_period.substring(9) + "限";
    }
    document.getElementById("openingClass").textContent = year_term_period.substring(4,6) + " " + selectedPeriod;
}
function getTPClassArr() {
    db.collection("year").doc(year).get().then((doc) => {
        if (doc.exists) {
            thisTPClassArr = doc.data()[`${year_term_period.substring(4)}Arr`];
        } else {
            console.log("No such document!");
        }
        if (isChangeStatus) {
            getLastSelectclassTPArr();
        } else {
            displayClass(0);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
function getLastSelectclassTPArr() {
    db.collection("year").doc(year).collection("classes").doc(classId).get().then((doc) => {
        if (doc.exists) {
            lastTermPeriodArr = doc.data()["termPeriodArr"];
        } else {
            console.log("No such document!");
        }
        displayClass(0);
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function displayClass(i) {
    db.collection("year").doc(year).collection("classes").doc(thisTPClassArr[i]).get().then((doc) => {
        if (doc.exists) {
            // クラスの一行表示
            let parent = document.classtable;

            let newRow1 = document.createElement('div');
            newRow1.setAttribute('class', 'classDetail');

            let newCB = document.createElement('div');
            newCB.setAttribute('class', 'form-check form-switch');
            newCB.setAttribute('id', 'checkBtn');

                let newCBinput = document.createElement('input');
                newCBinput.setAttribute('class', 'form-check-input');
                newCBinput.setAttribute('type', 'checkbox');
                newCBinput.setAttribute('id', `checkbox${i}`);
                newCBinput.setAttribute('name', 'className');
                newCBinput.setAttribute('onclick', `clickBtn('${doc.id}', ${i}, '${doc.data()['termPeriodArr']}')`);
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
            
            
            if (isChangeStatus && doc.data()["classId"] == classId) {
                // 選択済みクラスを選択できないようにする
                const className = document.classtable.className;
                if (i == 0) { // なんかclassName、一つの時だけListではなく単純に1つのタグが取り出されるみたいなので分ける
                    className.checked = true;
                    className.disabled = true;
                } else {
                    className[i].checked = true;
                    className[i].disabled = true;
                }
                // console.log(className);

                lockCheckboxNum = i;
                // lastTermPeriodArr = doc.data()["termPeriodArr"];
            } else {
                // 履修追加できないようにスイッチを切り替えられなくする
                // 履修放棄した場合でも選択できないもののスイッチを切り替えられなくする
                const tpArr = doc.data()['termPeriodArr'];
                checkCanAddClass(tpArr, i);
            }

        } else {
            console.log("No such document!");
        }
        // 次のクラスの一行表示を行う
        if (i + 1 != thisTPClassArr.length) {
            displayClass(i + 1);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}
function checkCanAddClass(tpArr, i) {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {
                const myYearContainArr = doc.data()["y2021ContainArr"];

                if (isChangeStatus) {
                    // 一旦更新
                    for (let i=0; i<lastTermPeriodArr.length; i++) {
                        myYearContainArr.splice(myYearContainArr.indexOf(lastTermPeriodArr[i]), 1);
                    }
                }

                let canAddClass = true;
                for (let i=0; i<tpArr.length; i++) {
                    if (myYearContainArr.includes(tpArr[i])) {
                        canAddClass = false;
                        break;
                    }
                }
                if (canAddClass == false) {
                    const className = document.classtable.className;
                    if (i == 0) { // なんかclassName、一つの時だけListではなく単純に1つのタグが取り出されるみたいなので分ける
                        className.disabled = true;
                    } else {
                        className[i].disabled = true;
                    }
                    console.log((i+1) + "　番目のチェックボックス　disabled");
                    
                }
            }
        });
    });
}



function clickBtn(docid, i, termPeriodArr){
    // if (isChangeStatus) {
    //     lockCheckbox();
    // }
    selectedClassdocid = docid; // 11J03とか
    selectedTermPeriodArr = termPeriodArr.split(",");
    const className = document.classtable.className;
    isSomethingSelected = false;
    for (let k = 0; k < className.length; k++){
        if (isChangeStatus && k == lockCheckboxNum) {
            continue;
        }
        if (className[k].id == "checkbox"+i) {
            isSomethingSelected = className[k].checked;
            checkDecideBtn(); // $('#decideBtn').prop('disabled', !isSomethingSelected);
            console.log("isSomethingSelected: " + isSomethingSelected);
            if (isSomethingSelected) {
                console.log("now select -> 時間割コード: ", selectedClassdocid);
            }
            continue;
        }
        className[k].checked = false;
    }
}

function checkDecideBtn() {
    if (isSomethingSelected) {
        $('#decideBtn').prop('disabled', false);
    } else {
        $('#decideBtn').prop('disabled', true);
    }
}

function confirmClass() {
    let msg = "";
    db.collection("year").doc(year).collection("classes").doc(selectedClassdocid).get().then((doc) => {
        if (doc.exists) {
            msg = `このクラスを選択しますか？\n${year_term_period.substring(4,6)} ${selectedPeriod}\n- 時間割コード：${doc.data()['id']} \n- 教科名：${doc.data()['name']} \n- 教員名：${doc.data()['teacher']} \n- 授業形態：${doc.data()['style']} \n- 単位数：${doc.data()['credit']}`;
            if (window.confirm(msg)) {
            // confirm で ok が押された時の処理
                if (isChangeStatus) {
                    deleteClassRegistration(true); // 更新の時この一行が実行される。この先でページ遷移する。addUserToClassUsers()もこの先で呼び出される
                } else if (isSomethingSelected) {
                    addUserToClassUsers(); // addの時この一行が実行される呼び出し先で最終的にページ遷移する
                }
            }
        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
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
                const myYearContainArr = doc.data()["y2021ContainArr"];
                console.log(myYearContainArr);
                console.log(lastTermPeriodArr);
                for (let i=0; i<lastTermPeriodArr.length; i++) {
                    console.log(myYearContainArr.indexOf(lastTermPeriodArr[i]));
                    myYearContainArr.splice(myYearContainArr.indexOf(lastTermPeriodArr[i]), 1);
                }
                console.log(myYearContainArr);

                // クラス配列フィールドから当てはまるidを削除する
                db.collection("account").doc(doc.id).update({
                    y2021MyClasses: firebase.firestore.FieldValue.arrayRemove(classId),
                    y2021ContainArr: myYearContainArr
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
    db.collection("year").doc(year).collection("classes").doc(classId).collection("users").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id);
            db.collection("year").doc(year).collection("classes").doc(classId).collection("users").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");

                if (bool == false) {
                    window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(year_term_period.substring(4,6));
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
    // year/.../users にuidフィールドを持ったドキュメントを追加  履修者一覧を表示するときに使う
    console.log(selectedClassdocid);
    db.collection("year").doc(year).collection("classes").doc(selectedClassdocid).collection("users").add({
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
                const myYearContainArr = doc.data()["y2021ContainArr"];
                console.log(myYearContainArr);
                console.log(selectedTermPeriodArr);
                for (let i=0; i<selectedTermPeriodArr.length; i++) {
                    myYearContainArr.push(selectedTermPeriodArr[i]);
                }
                console.log(myYearContainArr);

                db.collection('account').doc(doc.id)
                .get().then((doc2) => {
                    if (doc2.exists) {
                        if (typeof doc2.data()["y2021MyClasses"] === 'undefined') {
                            // 新しく配列フィールドを作成して追加
                            db.collection('account').doc(doc2.id).set({
                                y2021MyClasses: [selectedClassdocid],
                                y2021ContainArr: myYearContainArr
                            }, {merge: true})
                            .then(() => {
                                console.log("Document successfully written!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(year_term_period.substring(4,6));
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            // 既にある配列フィールドに追加
                            db.collection('account').doc(doc2.id).update({
                                y2021MyClasses: firebase.firestore.FieldValue.arrayUnion(selectedClassdocid),
                                y2021ContainArr: myYearContainArr
                            })
                            .then(() => {
                                console.log("Document successfully updated!");
                                window.location.href ='../timetable.html?name=' + encodeURIComponent(uid) + "?selectTerm=" + encodeURIComponent(year_term_period.substring(4,6));
                            })
                            .catch((error) => {
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


//

function setYearcontainsTermPeriod() {
    db.collection("account").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data()['uid'] == uid) {

                db.collection('account').doc(doc.id)
                .get().then((doc2) => {
                    if (doc2.exists) {
                        if (typeof doc2.data()["y2021ContainArr"] === 'undefined') {
                            // 新しく配列フィールドを作成して追加
                            db.collection('account').doc(doc2.id).set({
                                y2021ContainArr: []
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