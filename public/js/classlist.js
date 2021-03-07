
const db = firebase.firestore();
// ->URLから時限情報を取得
let query = location.search;
let value = query.split('=');
const roomsDocumentId = value[2];
console.log("urlから取得(表示する時限) => " + decodeURIComponent(roomsDocumentId));
// <-

let selectedPeriod;     // "月曜1限"とか
let selectedId;         // t1m1101 とか
let selectedClassName;  // "哲学"とか教科名
let selectedTeacher;    // 先生の名前
let selectedTerm;       // ターム 1~4のいづれか
let selectedClassDocId; // rooms/.../classes/各クラスのドキュメントID　と account/.../myClasses/各履修クラスのドキュメントID　とを一致させるために rooms/.../classes/各クラスのドキュメントID を取得

displayClass();

function displayClass() {
    
    db.collection("rooms").doc(roomsDocumentId).collection('classes').orderBy('classId').limit(1).get().then((querySnapshot) => { // 良い書き方が思い浮かばなかったがフィールドのperiodの値を取り出している
        querySnapshot.forEach((doc) => {
            document.getElementById("openingClass").textContent = doc.data()['period'];
            selectedPeriod = doc.data()['period'];
            console.log("[開講曜日・時限]" + selectedPeriod);
        });
    });


    db.collection("rooms").doc(roomsDocumentId).collection('classes').orderBy('classId').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()['id']}`);
            // console.log(`${doc.id} => ${doc.data()['name']}`);

            // let parent = document.getElementsByClassName("classtable")[0];
            let parent = document.classtable;

            let newRow1 = document.createElement('div');
            newRow1.setAttribute('class', 'classDetail');

                let newCB = document.createElement('div');
                newCB.setAttribute('class', 'form-check form-switch');

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
                newDetail.innerText = doc.data()['id'];
                newRow1.appendChild(newDetail);

                newDetail = document.createElement('div');
                newDetail.setAttribute('class', 'form-check form-switch');
                newDetail.innerText = doc.data()['name'];
                newRow1.appendChild(newDetail);

                newDetail = document.createElement('div');
                newDetail.setAttribute('class', 'form-check form-switch');
                newDetail.innerText = doc.data()['teacher'];
                newRow1.appendChild(newDetail);

            parent.appendChild(newRow1);
            // console.log(parent);

        });
    });
}

function clickBtn(classId, id, name, teacher, term, classDocId){
    const className = document.classtable.className;
    for (let i = 0; i < className.length; i++){
        if(className[i].id == "checkbox"+classId){
            selectedId = id;
            selectedClassName = name;
            selectedTeacher = teacher;
            selectedTerm = term;
            selectedClassDocId = classDocId;
            console.log("now select -> id: " + id + "  name: " + name + "  teacher: " + teacher);
            continue;
        }
        className[i].checked = false;
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
        // rooms/.../users にuidフィールドを持ったドキュメントを追加  履修者一覧を表示するときに使う
        db.collection("rooms").doc(roomsDocumentId).collection("classes")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data()['id'] == selectedId) {
                    db.collection("rooms").doc(roomsDocumentId).collection("classes").doc(doc.id).collection("users").add({
                        uid: uid
                    })
                    .then(() => {
                        console.log("Document written with ID: ");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
            })
        })

        // rooms/.../classes/各クラスのドキュメント と同じドキュメントを account/.../myClasses/下につくる
        db.collection("account")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data()['uid'] == uid) {
                    db.collection("account").doc(doc.id).collection("myClasses").doc(selectedClassDocId).set({
                        room: decodeURIComponent(roomsDocumentId),
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
    } else {
        
    }
}

